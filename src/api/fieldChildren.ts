import { gql } from '@apollo/client';
import { registerStub } from './stubLink';

// Not a real GraphQL-shaped response (Record<string, string[]> has no fixed
// field set) — kept opaque here since there's no schema validating it yet.
// A real resolver would more likely key this per-operation/field-id rather
// than by the field's display name; that shape decision is deferred until
// there's a backend to design against.
export const GET_FIELD_CHILDREN_QUERY = gql`
  query GetFieldChildren {
    fieldChildren
  }
`;

export interface GetFieldChildrenResult {
  fieldChildren: Record<string, string[]>;
}

// ponytail: no backend/resolver yet — registered on stubLink with the same
// map FieldsColumn used to import directly. Delete this registration once
// GetFieldChildren has a real resolver; call sites don't change.
export const FIELD_CHILDREN_FALLBACK: GetFieldChildrenResult = {
  fieldChildren: {
    'שם היחידה': ['שם מלא', 'שם קצר', 'שם בעברית'],
    'מפקד היחידה': ['דרגה', 'שם פרטי', 'שם משפחה'],
  },
};

registerStub('GetFieldChildren', (): GetFieldChildrenResult => FIELD_CHILDREN_FALLBACK);
