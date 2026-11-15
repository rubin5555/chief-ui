import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_FIELD_CHILDREN_QUERY = gql`
  query GetFieldChildren {
    fieldChildren
  }
`;

export interface GetFieldChildrenResult {
  fieldChildren: Record<string, string[]>;
}

export const useFieldChildren = () =>
  useApiQuery(GET_FIELD_CHILDREN_QUERY, (result: GetFieldChildrenResult) => result.fieldChildren);

// ponytail: no backend/resolver yet — registered on stubLink with the same

export const FIELD_CHILDREN_FALLBACK: GetFieldChildrenResult = {
  fieldChildren: {
    'שם היחידה': ['שם מלא', 'שם קצר', 'שם בעברית'],
    'מפקד היחידה': ['דרגה', 'שם פרטי', 'שם משפחה'],
  },
};

registerStub('GetFieldChildren', (): GetFieldChildrenResult => FIELD_CHILDREN_FALLBACK);
