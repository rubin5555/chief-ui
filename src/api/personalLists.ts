import { gql } from '@apollo/client';
import type { PersonalList } from '@/components/PeoplePicker';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_PERSONAL_LISTS_QUERY = gql`
  query GetPersonalLists {
    personalLists {
      id
      name
      tab
      lastUpdate
      members {
        name
        idNumber
        environment
      }
    }
  }
`;

export interface GetPersonalListsResult {
  personalLists: PersonalList[];
}

export const usePersonalLists = () =>
  useApiQuery(GET_PERSONAL_LISTS_QUERY, (result: GetPersonalListsResult) => result.personalLists);

// ponytail: no backend/resolver yet — registered on stubLink with the same
// catalog PersonalTab used to import directly. Delete this registration once
// GetPersonalLists has a real resolver; call sites don't change.
export const PERSONAL_LISTS_FALLBACK: GetPersonalListsResult = {
  personalLists: [
    {
      id: 'pl1',
      name: 'רשימת הפצה — מטה מבצעי',
      tab: 'mine',
      lastUpdate: '12.06.2026',
      members: [
        { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
        { name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
        { name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
      ],
    },
    {
      id: 'pl2',
      name: 'רשימת הפצה — לוגיסטיקה',
      tab: 'mine',
      lastUpdate: '08.06.2026',
      members: [
        { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
        { name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
        { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
        { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      ],
    },
    {
      id: 'pl3',
      name: 'צוות מודיעין — רשימה א׳',
      tab: 'mine',
      lastUpdate: '01.06.2026',
      members: [
        { name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
        { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      ],
    },
    {
      id: 'pl4',
      name: 'כלל קציני הקשר',
      tab: 'all',
      lastUpdate: '15.06.2026',
      members: [
        { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
        { name: 'תמר ברק', idNumber: '123456789', environment: 'ארגון ב׳' },
        { name: 'עמי שלו', idNumber: '134567890', environment: 'ארגון ד׳' },
      ],
    },
    {
      id: 'pl5',
      name: 'רשימת כוננות — מחלקת ביטחון',
      tab: 'all',
      lastUpdate: '10.06.2026',
      members: [
        { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
        { name: 'גיל אלון', idNumber: '156789012', environment: 'ארגון ג׳' },
        { name: 'רחל דוד', idNumber: '045678901', environment: 'ארגון ג׳' },
      ],
    },
    {
      id: 'pl6',
      name: 'מכלול תקשורת — פיקוד עורף',
      tab: 'all',
      lastUpdate: '05.06.2026',
      members: [
        { name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
        { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      ],
    },
  ],
};

registerStub('GetPersonalLists', (): GetPersonalListsResult => PERSONAL_LISTS_FALLBACK);
