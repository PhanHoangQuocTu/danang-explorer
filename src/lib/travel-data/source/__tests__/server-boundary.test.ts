import { expect, it } from 'vitest';

it('rejects the Google Sheets connector in a browser context', async () => {
  await expect(import('../google-sheets')).rejects.toThrow('Travel workbook downloads must run on the server.');
});
