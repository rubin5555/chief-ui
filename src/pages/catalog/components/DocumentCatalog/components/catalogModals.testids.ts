export const CATALOG_MODAL_IDS = {
  delete: 'catalog-delete-modal',
  cancel: 'catalog-cancel-modal',
  cancelToast: 'catalog-cancel-toast',
  receipts: 'catalog-receipts-modal',
  receiptRow: (name: string) => `catalog-receipt-row-${name}`,
  history: 'catalog-history-modal',
  historyStatusFilter: 'catalog-history-status-filter',
  historyRow: (ver: string) => `catalog-history-row-${ver}`,
} as const;
