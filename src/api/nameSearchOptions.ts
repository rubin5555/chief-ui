import { gql } from '@apollo/client';
import { useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export const GET_NAME_SEARCH_OPTIONS_QUERY = gql`
  query GetNameSearchOptions {
    nameSearchOptions
  }
`;

export interface GetNameSearchOptionsResult {
  nameSearchOptions: string[];
}

export const useNameSearchOptions = () =>
  useApiQuery(
    GET_NAME_SEARCH_OPTIONS_QUERY,
    (result: GetNameSearchOptionsResult) => result.nameSearchOptions,
  );

// ponytail: no backend/resolver yet — registered on stubLink with the same

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
