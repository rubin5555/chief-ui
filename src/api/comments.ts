import { gql } from '@apollo/client';
import { useApiMutation, useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export interface SectionCommentDto {
  id: string;
  sectionId: string;
  from: 'me' | 'other';
  authorName: string;
  text: string;
  quote?: string;
  createdAt: string;
}

export const GET_SECTION_COMMENTS_QUERY = gql`
  query GetSectionComments($sectionId: ID!) {
    sectionComments(sectionId: $sectionId) {
      id
      sectionId
      from
      authorName
      text
      quote
      createdAt
    }
  }
`;

export interface GetSectionCommentsResult {
  sectionComments: SectionCommentDto[];
}

export interface GetSectionCommentsVariables {
  sectionId: string;
}

export const useSectionComments = (sectionId: string) =>
  useApiQuery<GetSectionCommentsResult, SectionCommentDto[], GetSectionCommentsVariables>(
    GET_SECTION_COMMENTS_QUERY,
    (result) => result.sectionComments,
    { sectionId },
  );

export const ADD_SECTION_COMMENT_MUTATION = gql`
  mutation AddSectionComment($sectionId: ID!, $input: AddSectionCommentInput!) {
    addSectionComment(sectionId: $sectionId, input: $input) {
      id
      sectionId
      from
      authorName
      text
      quote
      createdAt
    }
  }
`;

export interface AddSectionCommentInput {
  text: string;
  quote?: string;
}

export interface AddSectionCommentResult {
  addSectionComment: SectionCommentDto;
}

export interface AddSectionCommentVariables {
  sectionId: string;
  input: AddSectionCommentInput;
}

export const useAddSectionComment = () =>
  useApiMutation<AddSectionCommentResult, AddSectionCommentVariables, SectionCommentDto>(
    ADD_SECTION_COMMENT_MUTATION,
    (result) => result.addSectionComment,
  );

const makeCommentId = () => `comment-${self.crypto.randomUUID()}`;

// ponytail: no backend/resolver yet — registered on stubLink, keyed by section
// id in a mutable map. Delete this registration once GetSectionComments/
// AddSectionComment have real resolvers; call sites don't change.
const SECTION_COMMENTS_FALLBACK: Record<string, SectionCommentDto[]> = {};

// main's CHAT_INIT (Edit.tsx:3159): an untouched thread isn't empty, it opens
// with a prompt from the other side. Built per call rather than shared, so the
// id is unique per thread and two open chats can't collide on a React key.
const seedThread = (sectionId: string): SectionCommentDto[] => [
  {
    id: `comment-seed-${sectionId}`,
    sectionId,
    from: 'other',
    authorName: 'שרי',
    text: 'איך אפשר לעזור בסעיף זה?',
    // `quote` must be an own property even when there is no quote. The query
    // selects it, and InMemoryCache treats a selected-but-absent key as an
    // incomplete write — the read-back then yields `data: undefined` for the
    // whole thread, so the seeded message silently never appears. Note the
    // AddSectionComment stub below gets this right by accident, via
    // `quote: input.quote`.
    quote: undefined,
    createdAt: new Date(0).toISOString(),
  },
];

registerStub('GetSectionComments', (variables): GetSectionCommentsResult => {
  const { sectionId } = variables as unknown as GetSectionCommentsVariables;
  return { sectionComments: SECTION_COMMENTS_FALLBACK[sectionId] ?? seedThread(sectionId) };
});

registerStub('AddSectionComment', (variables): AddSectionCommentResult => {
  const { sectionId, input } = variables as unknown as AddSectionCommentVariables;
  const comment: SectionCommentDto = {
    id: makeCommentId(),
    sectionId,
    from: 'me',
    authorName: 'את/ה',
    text: input.text,
    quote: input.quote,
    createdAt: new Date().toISOString(),
  };
  // Falls back to seedThread, not [], for the same reason the query does: this
  // is the first write to an untouched thread, and starting from an empty array
  // here would silently swallow the opening message the user was replying to.
  SECTION_COMMENTS_FALLBACK[sectionId] = [
    ...(SECTION_COMMENTS_FALLBACK[sectionId] ?? seedThread(sectionId)),
    comment,
  ];
  return { addSectionComment: comment };
});
