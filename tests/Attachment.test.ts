import { afterEach, expect, it, vi } from 'vitest';
import { Attachment } from '../src/types/Attachment';

afterEach(() => vi.unstubAllGlobals());

it.each(['native', 'node-fetch'])('downloads and caches %s response bytes across conversions', async (kind) => {
  const bytes = Buffer.from('héllo');
  const response =
    kind === 'native'
      ? { ok: true, arrayBuffer: async () => Uint8Array.from(bytes).buffer }
      : { ok: true, buffer: async () => bytes };
  const fetch = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetch);
  const attachment = new Attachment({ state: 'uploaded', urls: { original: 'https://example.test/file' } });
  expect(await attachment.toText()).toBe('héllo');
  expect(await attachment.toBase64()).toBe(bytes.toString('base64'));
  expect(Buffer.from(await attachment.toArrayBuffer())).toEqual(bytes);
  expect(fetch).toHaveBeenCalledExactlyOnceWith('https://example.test/file');
});

it('does not fetch absent attachments and permits retry after a failed download', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: false, statusText: 'Unavailable' })
    .mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new Uint8Array([1, 2]).buffer });
  vi.stubGlobal('fetch', fetch);
  await expect(new Attachment('pending').toBuffer()).rejects.toThrow('not present');
  expect(fetch).not.toHaveBeenCalled();
  const attachment = new Attachment({ state: 'uploaded', urls: { original: 'https://example.test/file' } });
  await expect(attachment.toBuffer()).rejects.toThrow('Attachment fetch failed: Unavailable');
  expect(await attachment.toBuffer()).toEqual(Buffer.from([1, 2]));
});

it('preserves only the supplied byte range for a local attachment', async () => {
  const bytes = Buffer.from([9, 1, 2, 9]);
  const attachment = await Attachment.create({ data: bytes.subarray(1, 3) });
  expect([...new Uint8Array(await attachment.toArrayBuffer())]).toEqual([1, 2]);
});
