import type { DocumentNode, OperationVariables } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';

// Backend-agnostic hook contract for the api layer. Components consume the
// per-resource hooks (useProfile, useDocs, ...) exported from each
// src/api/<resource>.ts file and never import @apollo/client themselves.
// This file is the only place the api layer's hooks touch Apollo's React
// API — to move to another data library (e.g. TanStack Query), reimplement
// useApiQuery/useApiMutation here (swapping each resource's DocumentNode for
// a fetcher) and no component call site changes.

export interface ApiQueryResult<TData> {
  data: TData | undefined;
  loading: boolean;
  error: Error | undefined;
}

// `select` unwraps the transport envelope (e.g. { profile: {...} } → profile)
// so components see resource data, not the GraphQL response shape. Omit it
// when the envelope itself is the useful shape (multi-collection results).
// `variables` is optional since most resources today fetch a fixed collection
// with no arguments — pass it for anything parameterized (e.g. fetch-by-id).
// `skip` avoids firing the query at all while a required variable (e.g. a
// not-yet-selected id) isn't available — the hook must still be called
// unconditionally per the rules of hooks, so this is the mechanism for that
// rather than an `if` around the call site.
export const useApiQuery = <
  TResult,
  TData = TResult,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
  select?: (result: TResult) => TData,
  variables?: TVariables,
  skip?: boolean,
): ApiQueryResult<TData> => {
  const { data, loading, error } = useQuery<TResult, TVariables>(query, {
    ...(variables ? { variables } : {}),
    skip,
  });
  const selected =
    data === undefined ? undefined : select ? select(data) : (data as unknown as TData);
  return { data: selected, loading, error };
};

export interface ApiMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  loading: boolean;
  error: Error | undefined;
}

export const useApiMutation = <TResult, TVariables extends OperationVariables, TData = TResult>(
  mutation: DocumentNode,
  select?: (result: TResult) => TData,
): ApiMutationResult<TData, TVariables> => {
  const [run, { loading, error }] = useMutation<TResult, TVariables>(mutation);
  const mutate = async (variables: TVariables): Promise<TData | undefined> => {
    const { data } = await run({ variables });
    return data == null ? undefined : select ? select(data) : (data as unknown as TData);
  };
  return { mutate, loading, error };
};
