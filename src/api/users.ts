import { gql } from '@apollo/client';
import type { NetworkFilter, NetworkPerson } from '@/components/PeoplePicker';
import { useApiQuery } from './hooks';
import { NETWORK_PEOPLE_FALLBACK } from './networkPeople';
import { registerStub } from './stubLink';

export type DirectoryUser = NetworkPerson;

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($idNumbers: [String!], $query: String, $network: String) {
    searchUsers(idNumbers: $idNumbers, query: $query, network: $network) {
      id
      name
      idNumber
      environment
      network
      networkLabel
    }
  }
`;

export interface SearchUsersResult {
  searchUsers: DirectoryUser[];
}

export interface UserSearchCriteria {
  idNumbers?: string[];
  query?: string;
  network?: NetworkFilter;
}

export const useUserSearch = ({ idNumbers, query, network }: UserSearchCriteria) => {
  const numbers = idNumbers ?? [];
  const text = query?.trim() ?? '';
  return useApiQuery(
    SEARCH_USERS_QUERY,
    (result: SearchUsersResult) => result.searchUsers,
    { idNumbers: numbers, query: text, network: network ?? null },
    numbers.length === 0 && text === '',
  );
};

// ponytail: no backend/resolver yet — answered from the same pool the network

registerStub('SearchUsers', (variables): SearchUsersResult => {
  const idNumbers = new Set((variables.idNumbers as string[] | undefined) ?? []);
  const query = ((variables.query as string | undefined) ?? '').trim();
  const network = variables.network as NetworkFilter | null | undefined;

  const pool = NETWORK_PEOPLE_FALLBACK.networkPeople.filter(
    (person) => !network || person.network === network,
  );

  if (idNumbers.size > 0) {
    return { searchUsers: pool.filter((person) => idNumbers.has(person.idNumber)) };
  }
  return {
    searchUsers: pool.filter(
      (person) => person.name.includes(query) || person.idNumber.includes(query),
    ),
  };
});
