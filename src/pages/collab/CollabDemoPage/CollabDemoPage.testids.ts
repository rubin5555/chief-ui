export const COLLAB_DEMO_IDS = {
  root: 'collab-demo-root',
  header: 'collab-demo-header',
  serverStatus: 'collab-demo-server-status',
  userPanel: (userId: string) => `collab-user-panel-${userId}`,
  userStatus: (userId: string) => `collab-user-status-${userId}`,
  sectionCard: (userId: string, sectionId: string) => `collab-section-${userId}-${sectionId}`,
  resetBtn: 'collab-demo-reset-btn',
  eventLog: 'collab-demo-event-log',
  eventItem: (id: string) => `collab-event-${id}`,
  clearLogBtn: 'collab-demo-clear-log-btn',
};
