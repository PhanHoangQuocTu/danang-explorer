import { Buffer } from 'node:buffer';
import { inflateRawSync } from 'node:zlib';

// Bound both the input and the work SheetJS can trigger while expanding the XLSX archive.
const MAX_ARCHIVE_BYTES = 8 * 1024 * 1024;
const MAX_EXPANDED_BYTES = 32 * 1024 * 1024;
const MAX_ARCHIVE_ENTRIES = 512;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const END_SIGNATURE = 0x06054b50;
const MIN_END_BYTES = 22;
const MAX_COMMENT_BYTES = 65_535;

export class WorkbookLimitError extends Error {}

const invalidArchive = () => new Error('Invalid XLSX archive.');

const findArchiveEnd = (data: Buffer): number => {
  const minimum = Math.max(0, data.length - MIN_END_BYTES - MAX_COMMENT_BYTES);
  for (let offset = data.length - MIN_END_BYTES; offset >= minimum; offset--) {
    if (
      data.readUInt32LE(offset) === END_SIGNATURE &&
      offset + MIN_END_BYTES + data.readUInt16LE(offset + 20) === data.length
    ) {
      return offset;
    }
  }
  throw invalidArchive();
};

export const inspectWorkbookArchive = (bytes: Uint8Array): Buffer => {
  if (bytes.byteLength > MAX_ARCHIVE_BYTES) throw new WorkbookLimitError();
  const data = Buffer.from(bytes);
  const end = findArchiveEnd(data);
  const entryCount = data.readUInt16LE(end + 10);
  const directoryStart = data.readUInt32LE(end + 16);
  const directorySize = data.readUInt32LE(end + 12);
  if (entryCount > MAX_ARCHIVE_ENTRIES) throw new WorkbookLimitError();
  if (
    entryCount === 0 ||
    data.readUInt16LE(end + 4) !== 0 ||
    data.readUInt16LE(end + 6) !== 0 ||
    data.readUInt16LE(end + 8) !== entryCount ||
    directoryStart + directorySize !== end
  ) {
    throw invalidArchive();
  }

  let directoryOffset = directoryStart;
  let expandedBytes = 0;
  const entryNames = new Set<string>();

  for (let entry = 0; entry < entryCount; entry++) {
    if (directoryOffset + 46 > end || data.readUInt32LE(directoryOffset) !== CENTRAL_SIGNATURE) throw invalidArchive();

    const flags = data.readUInt16LE(directoryOffset + 8);
    const method = data.readUInt16LE(directoryOffset + 10);
    const compressedSize = data.readUInt32LE(directoryOffset + 20);
    const expandedSize = data.readUInt32LE(directoryOffset + 24);
    const nameLength = data.readUInt16LE(directoryOffset + 28);
    const extraLength = data.readUInt16LE(directoryOffset + 30);
    const commentLength = data.readUInt16LE(directoryOffset + 32);
    const local = data.readUInt32LE(directoryOffset + 42);
    const nameOffset = directoryOffset + 46;
    directoryOffset = nameOffset + nameLength + extraLength + commentLength;
    expandedBytes += expandedSize;

    if (expandedBytes > MAX_EXPANDED_BYTES) throw new WorkbookLimitError();
    if (
      directoryOffset > end ||
      nameLength === 0 ||
      (flags & 1) !== 0 ||
      local + 30 > directoryStart ||
      data.readUInt32LE(local) !== LOCAL_SIGNATURE ||
      data.readUInt16LE(local + 6) !== flags ||
      data.readUInt16LE(local + 8) !== method ||
      data.readUInt16LE(local + 26) !== nameLength
    ) {
      throw invalidArchive();
    }

    const name = data.toString('utf8', nameOffset, nameOffset + nameLength);
    const localName = data.subarray(local + 30, local + 30 + nameLength);
    const compressedStart = local + 30 + nameLength + data.readUInt16LE(local + 28);
    const compressedEnd = compressedStart + compressedSize;
    if (
      entryNames.has(name) ||
      !localName.equals(data.subarray(nameOffset, nameOffset + nameLength)) ||
      compressedEnd > directoryStart
    ) {
      throw invalidArchive();
    }
    entryNames.add(name);

    if ((flags & 8) === 0) {
      if (data.readUInt32LE(local + 18) !== compressedSize || data.readUInt32LE(local + 22) !== expandedSize) {
        throw invalidArchive();
      }
    } else {
      const descriptor = compressedEnd + (data.readUInt32LE(compressedEnd) === 0x08074b50 ? 4 : 0);
      if (
        descriptor + 12 > directoryStart ||
        data.readUInt32LE(descriptor + 4) !== compressedSize ||
        data.readUInt32LE(descriptor + 8) !== expandedSize
      ) {
        throw invalidArchive();
      }
    }

    if (method === 0 && compressedSize === expandedSize) continue;
    if (method !== 8) throw invalidArchive();

    // Check actual decompression against a hard bound even if ZIP metadata underreports it.
    const inflated = inflateRawSync(data.subarray(compressedStart, compressedEnd), {
      maxOutputLength: Math.max(1, expandedSize),
    });
    if (inflated.length !== expandedSize) throw invalidArchive();
  }

  if (directoryOffset !== end || !entryNames.has('[Content_Types].xml') || !entryNames.has('xl/workbook.xml')) {
    throw invalidArchive();
  }
  return data;
};
