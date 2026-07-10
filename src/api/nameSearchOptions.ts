import { gql } from '@apollo/client';
import { registerStub } from './stubLink';

export const GET_NAME_SEARCH_OPTIONS_QUERY = gql`
  query GetNameSearchOptions {
    nameSearchOptions
  }
`;

export interface GetNameSearchOptionsResult {
  nameSearchOptions: string[];
}

// ponytail: no backend/resolver yet — registered on stubLink with the same
// list OperationParams used to import directly. Delete this registration
// once GetNameSearchOptions has a real resolver; call sites don't change.
export const NAME_SEARCH_OPTIONS_FALLBACK: GetNameSearchOptionsResult = {
  nameSearchOptions: [
    'אבי כהן',
    'שרה לוי',
    'משה ישראלי',
    'רחל דוד',
    'יוסף מזרחי',
    'מירי פרץ',
    'דני אברהם',
    'לאה כץ',
    'אורן שמש',
    'נועה גרין',
    'יעקב בן-דוד',
    'תמר ברק',
    'עמי שלו',
    'ריקי נחום',
    'גיל אלון',
  ],
};

registerStub(
  'GetNameSearchOptions',
  (): GetNameSearchOptionsResult => NAME_SEARCH_OPTIONS_FALLBACK,
);
