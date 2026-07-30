import type { FetchResult } from '@apollo/client';
import { ApolloLink, Observable } from '@apollo/client';

type StubResolver = (variables: Record<string, unknown>) => unknown;

const resolvers = new Map<string, StubResolver>();

export const registerStub = (operationName: string, resolver: StubResolver): void => {
  resolvers.set(operationName, resolver);
};

const STUB_DELAY_MS = 500;

// ponytail: answers every registered operation from an in-memory hardcoded

export const stubLink = new ApolloLink((operation) => {
  return new Observable<FetchResult>((observer) => {
    const resolver = resolvers.get(operation.operationName);
    if (!resolver) {
      observer.error(
        new Error(`No stub registered for GraphQL operation "${operation.operationName}"`),
      );
      return;
    }
    const timer = setTimeout(() => {
      observer.next({ data: resolver(operation.variables) } as FetchResult);
      observer.complete();
    }, STUB_DELAY_MS);
    return () => clearTimeout(timer);
  });
});
