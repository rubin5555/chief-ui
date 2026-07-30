import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, radii, transitions } from '@/styles/theme';

export const SignaturesBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RequiredWarning = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: ${docColors.warningStrong};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const HeaderBtn = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${radii.lg};
  font-size: 11px;
  font-weight: 600;
  color: ${colors.primary};
  transition: background-color ${transitions.normal};
`;

export const TemplatesBtn = styled(HeaderBtn)`
  background-color: ${colors.primaryLight};
  border: 1px solid ${docColors.primaryLightBorder};

  &:hover {
    background-color: ${colors.surface};
  }
`;

export const AddSignatureBtn = styled(HeaderBtn)`
  border: 1px dashed ${docColors.primaryLightBorder};

  &:hover {
    background-color: ${colors.primaryLight};
  }
`;
