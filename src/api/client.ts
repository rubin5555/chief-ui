import { ApolloClient, InMemoryCache } from '@apollo/client';

// No backend exists yet — see the resource files in this folder (profile.ts etc.),
// which stub their fetch/mutate functions with hardcoded fallbacks instead of
// calling this client. It's wired into the app root now (src/index.tsx) so the
// swap to real queries later touches only the resource files, not app setup.
const GRAPHQL_ENDPOINT = '/graphql';

export const apolloClient = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});
