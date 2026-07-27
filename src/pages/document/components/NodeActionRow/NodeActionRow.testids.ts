// Each control on the row carries its own id, declared with the component that
// renders it — LAST_MODIFIED_STAMP_IDS, SOURCE_REFRESH_BUTTON_IDS,
// COPY_NODE_BUTTON_IDS, and for the slots, whatever the caller passes in.
export const NODE_ACTION_ROW_IDS = {
  root: (nodeId: string) => `node-action-row-${nodeId}`,
};
