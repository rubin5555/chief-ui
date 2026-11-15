import { isStaleChunkError, recoverFromStaleChunk } from './chunkRecovery';

export const chunkGuard =
  <TModule>(factory: () => Promise<TModule>) =>
  () =>
    factory().catch((error: unknown) => {
      if (isStaleChunkError(error) && recoverFromStaleChunk()) {
        return new Promise<TModule>(() => {});
      }
      throw error;
    });
