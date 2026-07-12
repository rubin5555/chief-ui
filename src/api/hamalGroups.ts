import { gql } from '@apollo/client';
import type { HamalGroup } from '@/modals/MailingListModal';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_HAMAL_GROUPS_QUERY = gql`
  query GetHamalGroups {
    hamalGroups {
      id
      name
      type
      environment
      memberCount
      members {
        name
        idNumber
        environment
      }
    }
  }
`;

export interface GetHamalGroupsResult {
  hamalGroups: HamalGroup[];
}

export const useHamalGroups = () =>
  useApiQuery(GET_HAMAL_GROUPS_QUERY, (result: GetHamalGroupsResult) => result.hamalGroups);

// ponytail: no backend/resolver yet — registered on stubLink with the same
// catalog HamalTab used to import directly. Delete this registration once
// GetHamalGroups has a real resolver; call sites don't change.
export const HAMAL_GROUPS_FALLBACK: GetHamalGroupsResult = {
  hamalGroups: [
    {
      id: 'h1',
      name: 'חמל ביטחון שטח',
      type: 'ביטחוני',
      environment: 'ארגון א׳',
      memberCount: 12,
      members: [
        { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
        { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
        { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
        { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
      ],
    },
    {
      id: 'h2',
      name: 'חמל לוגיסטי',
      type: 'לוגיסטי',
      environment: 'ארגון ב׳',
      memberCount: 8,
      members: [
        { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
        { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
        { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      ],
    },
    {
      id: 'h3',
      name: 'חמל מודיעין',
      type: 'מודיעיני',
      environment: 'ארגון א׳',
      memberCount: 6,
      members: [
        { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
        { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      ],
    },
    {
      id: 'h4',
      name: 'חמל תקשורת',
      type: 'תקשורתי',
      environment: 'ארגון ג׳',
      memberCount: 5,
      members: [
        { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
        { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
      ],
    },
    {
      id: 'h5',
      name: 'חמל רפואי',
      type: 'רפואי',
      environment: 'ארגון ב׳',
      memberCount: 9,
      members: [
        { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
        { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
        { name: 'עמי שלו', idNumber: '134567890', environment: 'ארגון ד׳' },
        { name: 'רחל דוד', idNumber: '045678901', environment: 'ארגון ג׳' },
      ],
    },
  ],
};

registerStub('GetHamalGroups', (): GetHamalGroupsResult => HAMAL_GROUPS_FALLBACK);
