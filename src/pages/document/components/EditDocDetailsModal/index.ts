export * from './EditDocDetailsModal';
// The mode is part of this modal's public surface — whoever opens it has to name
// one. Type-only, so a caller can import it from the barrel without pulling the
// modal itself out of its lazy chunk.
export type { EditDocDetailsMode } from './EditDocDetailsModal.constants';
