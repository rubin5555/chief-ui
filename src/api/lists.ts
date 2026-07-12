import { gql } from '@apollo/client';
import type { Member } from '@/modals/MailingListModal';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export interface DistributionListDto {
  id: string;
  name: string;
  memberCount?: number;
  members?: Member[];
  department?: string;
}

export const GET_LISTS_QUERY = gql`
  query GetLists {
    lists {
      id
      name
      memberCount
      department
      members {
        id
        name
        idNumber
        environment
      }
    }
    deletedLists {
      id
      name
      department
    }
  }
`;

export interface GetListsResult {
  lists: DistributionListDto[];
  deletedLists: DistributionListDto[];
}

// No `select`: the two collections travel together, so the envelope is the shape.
export const useLists = () => useApiQuery<GetListsResult>(GET_LISTS_QUERY);

// ponytail: no backend/resolver yet — registered on stubLink with the same
// catalog ProfilePage used to import directly. Delete this registration once
// GetLists has a real resolver; call sites don't change.
export const LISTS_FALLBACK: GetListsResult = {
  lists: [
    {
      id: 'l1',
      name: 'רשימת הפצה — מטה מבצעי',
      memberCount: 3,
      department: 'מחלקה א׳',
      members: [
        { id: 'p1', name: 'אבי כהן', idNumber: '012345678', environment: 'ארגון א׳' },
        { id: 'p2', name: 'שרה לוי', idNumber: '023456789', environment: 'ארגון ב׳' },
        { id: 'p6', name: 'מירי פרץ', idNumber: '067890123', environment: 'ארגון א׳' },
      ],
    },
    {
      id: 'l2',
      name: 'רשימת הפצה — לוגיסטיקה',
      memberCount: 4,
      department: 'מחלקה ב׳',
      members: [
        { id: 'p3', name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
        { id: 'p8', name: 'לאה כץ', idNumber: '089012345', environment: 'ארגון ב׳' },
        { id: 'p5', name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
        { id: 'p7', name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      ],
    },
    {
      id: 'l3',
      name: 'צוות מודיעין — רשימה א׳',
      memberCount: 2,
      department: 'מחלקה ג׳',
      members: [
        { id: 'p9', name: 'אורן שמש', idNumber: '090123456', environment: 'ארגון א׳' },
        { id: 'p10', name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      ],
    },
  ],
  deletedLists: [{ id: 'ld1', name: 'רשימה ישנה שנמחקה', department: 'מחלקה א׳' }],
};

registerStub('GetLists', (): GetListsResult => LISTS_FALLBACK);
