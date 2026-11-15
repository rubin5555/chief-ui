import { gql } from '@apollo/client';
import { useApiMutation, useApiQuery } from './hooks';
import { registerStub } from './stubLink';

export interface ProfileDto {
  name: string;
  id: string;
  organization: string;
}

export const GET_PROFILE_QUERY = gql`
  query GetProfile {
    profile {
      name
      id
      organization
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      name
      id
      organization
    }
  }
`;

export interface GetProfileResult {
  profile: ProfileDto;
}

export interface UpdateProfileResult {
  updateProfile: ProfileDto;
}

export interface UpdateProfileVariables {
  input: Partial<ProfileDto>;
}

export const useProfile = () =>
  useApiQuery(GET_PROFILE_QUERY, (result: GetProfileResult) => result.profile);

export const useUpdateProfile = () =>
  useApiMutation<UpdateProfileResult, UpdateProfileVariables, ProfileDto>(
    UPDATE_PROFILE_MUTATION,
    (result) => result.updateProfile,
  );

// ponytail: no backend/resolver yet — registered on stubLink instead of a

export const PROFILE_FALLBACK: ProfileDto = {
  name: 'ישראל ישראלי',
  id: '1234567',
  organization: 'אגף המבצעים',
};

registerStub('GetProfile', (): GetProfileResult => ({ profile: PROFILE_FALLBACK }));

registerStub('UpdateProfile', (variables): UpdateProfileResult => {
  const { input } = variables as unknown as UpdateProfileVariables;
  Object.assign(PROFILE_FALLBACK, input);
  return { updateProfile: PROFILE_FALLBACK };
});
