import { gql } from '@apollo/client';
import type { NetworkFilter, NetworkPerson } from '@/components/PeoplePicker';
import { useApiQuery } from './hooks';
import { NETWORK_PEOPLE_FALLBACK } from './networkPeople';
import { registerStub } from './stubLink';

/**
 * What the directory answers with. Structurally main's network person — the
 * same people, reached by asking rather than by filtering a copy.
 */
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
  /** Exact personal numbers — what a spreadsheet import has to ask. */
  idNumbers?: string[];
  /** Free text over name and personal number — what a search box asks. */
  query?: string;
  /** Narrows either question to one network. */
  network?: NetworkFilter;
}

/**
 * Find people in the directory.
 *
 * One operation for both ways of asking, because they are the same question put
 * differently and the answer has the same shape either way. Two operations would
 * have meant two resolvers to keep in step over what a user is.
 *
 * A search, not a filter: the directory stays on the server and only the answer
 * crosses. Numbers it doesn't answer for belong to nobody, which the caller
 * reads off the gap rather than being told separately.
 *
 * Idle while there is nothing to ask about — `skip`, since the hook still has to
 * be called. Debouncing is the caller's, so that a search box asks once the
 * typing settles rather than once per keystroke.
 */
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
// directory is stubbed with. Delete this registration once SearchUsers has a
// real resolver; call sites don't change.
registerStub('SearchUsers', (variables): SearchUsersResult => {
  const idNumbers = new Set((variables.idNumbers as string[] | undefined) ?? []);
  const query = ((variables.query as string | undefined) ?? '').trim();
  const network = variables.network as NetworkFilter | null | undefined;

  const pool = NETWORK_PEOPLE_FALLBACK.networkPeople.filter(
    (person) => !network || person.network === network,
  );

  // Numbers win when both are given: they are an exact question, and a text
  // match on top of them could only ever remove a row that was asked for by name.
  if (idNumbers.size > 0) {
    return { searchUsers: pool.filter((person) => idNumbers.has(person.idNumber)) };
  }
  return {
    searchUsers: pool.filter(
      (person) => person.name.includes(query) || person.idNumber.includes(query),
    ),
  };
});
