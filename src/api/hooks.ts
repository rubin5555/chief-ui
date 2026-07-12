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
export const useApiQuery = <TResult, TData = TResult>(
  query: DocumentNode,
  select?: (result: TResult) => TData,
): ApiQueryResult<TData> => {
  const { data, loading, error } = useQuery<TResult>(query);
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
