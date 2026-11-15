import { ApolloClient, InMemoryCache } from '@apollo/client';
import { stubLink } from './stubLink';

export const apolloClient = new ApolloClient({
  link: stubLink,
  cache: new InMemoryCache(),
});
