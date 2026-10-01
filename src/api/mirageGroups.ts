import { gql } from '@apollo/client';
import type { MirageGroup } from '@/components/PeoplePicker';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_MIRAGE_GROUPS_QUERY = gql`
  query GetMirageGroups {
    mirageGroups {
      id
      name
      type
      environment
      members {
        name
        idNumber
        environment
      }
    }
  }
`;

export interface GetMirageGroupsResult {
  mirageGroups: MirageGroup[];
}

export const useMirageGroups = () =>
  useApiQuery(GET_MIRAGE_GROUPS_QUERY, (result: GetMirageGroupsResult) => result.mirageGroups);

// ponytail: no backend/resolver yet — registered on stubLink with the same

export const MIRAGE_GROUPS_FALLBACK: GetMirageGroupsResult = {
  mirageGroups: [
    {
      id: 'm1',
      name: "מיראז' קרבי",
      type: 'קרבי',
      environment: 'ארגון א׳',
      members: [
        { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
        { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
        { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
      ],
    },
    {
      id: 'm2',
      name: "מיראז' סייבר",
      type: 'סייבר',
      environment: 'ארגון ב׳',
      members: [
        { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
        { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
        { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      ],
    },
    {
      id: 'm3',
      name: "מיראז' מודיעין",
      type: 'מודיעיני',
      environment: 'ארגון א׳',
      members: [
        { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
        { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      ],
    },
    {
      id: 'm4',
      name: "מיראז' לוגיסטי",
      type: 'לוגיסטי',
      environment: 'ארגון ג׳',
      members: [
        { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
        { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
        { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
      ],
    },
    {
      id: 'm5',
      name: "מיראז' רפואי",
      type: 'רפואי',
      environment: 'ארגון ב׳',
      members: [
        { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
        { name: 'עמי שלו', idNumber: '134567890', environment: 'ארגון ד׳' },
        { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
        { name: 'רחל דוד', idNumber: '045678901', environment: 'ארגון ג׳' },
      ],
    },
  ],
};

registerStub('GetMirageGroups', (): GetMirageGroupsResult => MIRAGE_GROUPS_FALLBACK);
