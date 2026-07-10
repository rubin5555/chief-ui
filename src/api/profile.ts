import { gql } from '@apollo/client';

// DTO owned by the api layer, independent of ProfileSidebar's ProfileInfo prop
// type — the two happen to match today, but a UI component's prop shape
// shouldn't dictate the server contract.
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

// ponytail: no backend/resolver yet — resolves with a hardcoded fallback
// instead of calling apolloClient.query(GET_PROFILE_QUERY). Swap the body for
// a real query when a resolver exists; callers already await a Promise<ProfileDto>
// so the signature won't need to change.
const FALLBACK_PROFILE: ProfileDto = {
  name: 'ישראל ישראלי',
  id: '1234567',
  organization: 'אגף המבצעים',
};

export const fetchProfile = async (): Promise<ProfileDto> => FALLBACK_PROFILE;

// ponytail: same ceiling as fetchProfile — mutates the in-memory fallback
// instead of calling apolloClient.mutate(UPDATE_PROFILE_MUTATION). Swap for a
// real mutation (with an explicit cache `update`, per state-network.md) once
// a resolver exists.
export const updateProfile = async (input: Partial<ProfileDto>): Promise<ProfileDto> => {
  Object.assign(FALLBACK_PROFILE, input);
  return FALLBACK_PROFILE;
};
