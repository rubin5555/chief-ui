const RECOVERY_KEY = 'chief-chunk-recovery-at';

const COOLDOWN_MS = 10_000;

const STALE_CHUNK_PATTERNS = [
  /ChunkLoadError/i,
  /Loading (css )?chunk .+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
  /not a supported stylesheet MIME type/i,
];

export const isStaleChunkError = (error: unknown): boolean => {
  const text = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return STALE_CHUNK_PATTERNS.some((pattern) => pattern.test(text));
};

export const recoverFromStaleChunk = (): boolean => {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RECOVERY_KEY) ?? 0);
  } catch {
    return false;
  }

  if (Date.now() - last < COOLDOWN_MS) return false;

  try {
    sessionStorage.setItem(RECOVERY_KEY, String(Date.now()));
  } catch {
    return false;
  }

  window.location.reload();
  return true;
};
