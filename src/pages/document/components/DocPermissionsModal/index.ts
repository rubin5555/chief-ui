// The dialog itself is deliberately not exported: it is reached by asking the
// provider to open it, so one place decides when it is on screen.
export {
  DocPermissionsProvider,
  type DocPermissionsRequest,
  useDocPermissions,
} from './DocPermissionsContext';
export { SECTION_PERMISSION_LEVEL_IDS } from './DocPermissionsModal.constants';
