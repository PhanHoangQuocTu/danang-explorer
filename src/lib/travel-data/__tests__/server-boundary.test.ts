import { expect, it } from 'vitest';

it('rejects importing the workbook parser in a browser context', async () => {
  await expect(import('../workbook')).rejects.toThrow('Travel workbooks must be processed on the server.');
});
