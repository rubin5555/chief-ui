import { ApolloClient, InMemoryCache } from '@apollo/client';
import { stubLink } from './stubLink';

// No backend exists yet — every operation currently flows through stubLink,
// which answers from the hardcoded fallbacks each resource file registers
// (see profile.ts for the reference shape). Swap `link: stubLink` for a real
// HttpLink once a backend exists; queries/mutations elsewhere don't change.
export const apolloClient = new ApolloClient({
  link: stubLink,
  cache: new InMemoryCache(),
});
