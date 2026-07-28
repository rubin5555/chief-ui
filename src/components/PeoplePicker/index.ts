// Picking people out of the organisation's directories — networks, an existing
// document's distribution, HML and Mirage groups, personal lists — and into a
// list you are building.
//
// Two consumers, which is why it lives here rather than inside either of them:
// src/modals/MailingListFormModal fills a mailing list with it, and the document
// page's DocPermissionsModal hands out a permission with it. They arrange the
// halves differently, so the halves are separate components.
export { MembersPanel } from './components/MembersPanel';
export { PeopleSourcesPanel } from './components/PeopleSourcesPanel';
export type {
  DocItem,
  HamalGroup,
  ImportTabId,
  Member,
  MirageGroup,
  NetworkPerson,
  PersonalList,
  PersonMember,
} from './PeoplePicker.constants';
export { PEOPLE_PICKER_IDS } from './PeoplePicker.testids';
