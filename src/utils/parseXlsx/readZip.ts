const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_FILE_SIGNATURE = 0x02014b50;
const EOCD_MIN_SIZE = 22;

const MAX_ZIP_COMMENT = 0xffff;
const ZIP64_SENTINEL = 0xffffffff;

const STORED = 0;
const DEFLATED = 8;

const utf8 = new TextDecoder();

export interface ZipEntry {
  name: string;
  readText: () => Promise<string>;
}

const findEndOfCentralDirectory = (view: DataView): number => {
  const earliest = Math.max(0, view.byteLength - EOCD_MIN_SIZE - MAX_ZIP_COMMENT);
  for (let at = view.byteLength - EOCD_MIN_SIZE; at >= earliest; at--) {
    if (view.getUint32(at, true) === EOCD_SIGNATURE) return at;
  }
  throw new Error('not a zip archive');
};

const inflate = async (data: Uint8Array, method: number): Promise<string> => {
  if (method === STORED) return utf8.decode(data);
  if (method !== DEFLATED) throw new Error(`unsupported zip compression method ${method}`);

  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(stream).text();
};

export const readZip = (buffer: ArrayBuffer): ZipEntry[] => {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const eocd = findEndOfCentralDirectory(view);

  const entryCount = view.getUint16(eocd + 10, true);
  const centralDirectoryOffset = view.getUint32(eocd + 16, true);
  if (centralDirectoryOffset === ZIP64_SENTINEL)
    throw new Error('zip64 archives are not supported');

  const entries: ZipEntry[] = [];
  let at = centralDirectoryOffset;

  for (let i = 0; i < entryCount; i++) {
    if (view.getUint32(at, true) !== CENTRAL_FILE_SIGNATURE) {
      throw new Error('corrupt zip central directory');
    }
    const method = view.getUint16(at + 10, true);

    const compressedSize = view.getUint32(at + 20, true);
    const nameLength = view.getUint16(at + 28, true);
    const extraLength = view.getUint16(at + 30, true);
    const commentLength = view.getUint16(at + 32, true);
    const localHeaderOffset = view.getUint32(at + 42, true);
    const name = utf8.decode(bytes.subarray(at + 46, at + 46 + nameLength));

    entries.push({
      name,
      readText: () => {
        const localNameLength = view.getUint16(localHeaderOffset + 26, true);
        const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
        const start = localHeaderOffset + 30 + localNameLength + localExtraLength;
        return inflate(bytes.subarray(start, start + compressedSize), method);
      },
    });

    at += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
};
