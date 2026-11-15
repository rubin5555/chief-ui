import type { DocumentNode, OperationVariables } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';

export interface ApiQueryResult<TData> {
  data: TData | undefined;
  loading: boolean;
  error: Error | undefined;
}

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
