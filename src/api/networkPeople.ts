import { gql } from '@apollo/client';
import type { NetworkPerson } from '@/modals/MailingListFormModal';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_NETWORK_PEOPLE_QUERY = gql`
  query GetNetworkPeople {
    networkPeople {
      id
      name
      idNumber
      environment
      network
      networkLabel
    }
  }
`;

export interface GetNetworkPeopleResult {
  networkPeople: NetworkPerson[];
}

export const useNetworkPeople = () =>
  useApiQuery(GET_NETWORK_PEOPLE_QUERY, (result: GetNetworkPeopleResult) => result.networkPeople);

// ponytail: no backend/resolver yet — registered on stubLink with the same
// pool NetworkTab/HamalAddMemberPanel/HamalCreateGroupPanel used to import
// directly. Delete this registration once GetNetworkPeople has a real
// resolver; call sites don't change.
export const NETWORK_PEOPLE_FALLBACK: GetNetworkPeopleResult = {
  networkPeople: [
    {
      id: 'p1',
      name: 'אבי כהן',
      idNumber: '012345678',
      environment: 'ארגון א׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p2',
      name: 'שרה לוי',
      idNumber: '023456789',
      environment: 'ארגון ב׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p3',
      name: 'משה ישראלי',
      idNumber: '034567890',
      environment: 'ארגון א׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p4',
      name: 'רחל דוד',
      idNumber: '045678901',
      environment: 'ארגון ג׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p5',
      name: 'יוסף מזרחי',
      idNumber: '056789012',
      environment: 'ארגון ב׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p6',
      name: 'מירי פרץ',
      idNumber: '067890123',
      environment: 'ארגון א׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p7',
      name: 'דני אברהם',
      idNumber: '078901234',
      environment: 'ארגון ד׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p8',
      name: 'לאה כץ',
      idNumber: '089012345',
      environment: 'ארגון ב׳',
      network: 'sodibioti',
      networkLabel: 'סודי ביותר',
    },
    {
      id: 'p9',
      name: 'אורן שמש',
      idNumber: '090123456',
      environment: 'ארגון א׳',
      network: 'sodi',
      networkLabel: 'מערכת סודי',
    },
    {
      id: 'p10',
      name: 'נועה גרין',
      idNumber: '101234567',
      environment: 'ארגון ג׳',
      network: 'sodi',
      networkLabel: 'מערכת סודי',
    },
    {
      id: 'p11',
      name: 'יעקב בן-דוד',
      idNumber: '112345678',
      environment: 'ארגון א׳',
      network: 'sodi',
      networkLabel: 'מערכת סודי',
    },
    {
      id: 'p12',
      name: 'תמר ברק',
      idNumber: '123456789',
      environment: 'ארגון ב׳',
      network: 'sodi',
      networkLabel: 'מערכת סודי',
    },
    {
      id: 'p13',
      name: 'עמי שלו',
      idNumber: '134567890',
      environment: 'ארגון ד׳',
      network: 'aman',
      networkLabel: 'אמ"ן',
    },
    {
      id: 'p14',
      name: 'ריקי נחום',
      idNumber: '145678901',
      environment: 'ארגון א׳',
      network: 'aman',
      networkLabel: 'אמ"ן',
    },
    {
      id: 'p15',
      name: 'גיל אלון',
      idNumber: '156789012',
      environment: 'ארגון ג׳',
      network: 'aman',
      networkLabel: 'אמ"ן',
    },
  ],
};

registerStub('GetNetworkPeople', (): GetNetworkPeopleResult => NETWORK_PEOPLE_FALLBACK);
