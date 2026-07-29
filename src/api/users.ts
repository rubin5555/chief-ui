import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { NETWORK_PEOPLE_FALLBACK } from './networkPeople';
import { registerStub } from './stubLink';

export interface DirectoryUser {
  id: string;
  name: string;
  idNumber: string;
  environment: string;
}

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($idNumbers: [String!]!) {
    searchUsers(idNumbers: $idNumbers) {
      id
      name
      idNumber
      environment
    }
  }
`;

export interface SearchUsersResult {
  searchUsers: DirectoryUser[];
}

/**
 * Look up people by personal number.
 *
 * A search, not a filter: the caller sends the numbers it has and the server
 * answers with the people it knows — so the directory never has to be shipped
 * to the browser to be matched against. Numbers it doesn't answer for belong to
 * nobody, which is a fact the caller reads off the gap rather than being told
 * separately.
 *
 * Idle while there is nothing to ask about (`skip`, since the hook still has to
 * be called).
 */
export const useUserSearch = (idNumbers: string[]) =>
  useApiQuery(
    SEARCH_USERS_QUERY,
    (result: SearchUsersResult) => result.searchUsers,
    { idNumbers },
    idNumbers.length === 0,
  );

// ponytail: no backend/resolver yet — answered from the same directory pool
// NetworkTab filters in the browser today. Delete this registration once
// SearchUsers has a real resolver; call sites don't change. NetworkTab could
// move onto this hook too, which is the point of it taking a list rather than
// being shaped around the spreadsheet that needed it first.
registerStub('SearchUsers', (variables): SearchUsersResult => {
  const wanted = new Set((variables.idNumbers as string[] | undefined) ?? []);
  return {
    searchUsers: NETWORK_PEOPLE_FALLBACK.networkPeople
      .filter((person) => wanted.has(person.idNumber))
      .map(({ id, name, idNumber, environment }) => ({ id, name, idNumber, environment })),
  };
});
