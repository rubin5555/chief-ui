import type { FetchResult } from '@apollo/client';
import { ApolloLink, Observable } from '@apollo/client';

// Return type is intentionally loose (unknown, not Record<string, unknown>) so
// each resource file's resolver can return its own concrete named interface
// (e.g. GetProfileResult) without an index-signature mismatch; the resolver's
// own `(): GetProfileResult =>` annotation is what keeps that call site typed.
type StubResolver = (variables: Record<string, unknown>) => unknown;

const resolvers = new Map<string, StubResolver>();

// Resource files (profile.ts etc.) call this once per operation, at module
// load, to register the hardcoded data stubLink should answer with.
export const registerStub = (operationName: string, resolver: StubResolver): void => {
  resolvers.set(operationName, resolver);
};

// Simulated network latency so useQuery's `loading` state is actually
// observable in the UI instead of resolving on the same tick. Tune down (or
// remove) once real latency exists to compare against.
const STUB_DELAY_MS = 500;

// ponytail: answers every registered operation from an in-memory hardcoded
// resolver instead of a real network request — this is the whole adapter:
// swap this link for a real HttpLink once a backend exists, and every
// useQuery/useMutation call site (and the registry itself) stays unchanged.
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
