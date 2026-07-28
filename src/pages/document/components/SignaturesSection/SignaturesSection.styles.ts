import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, radii, transitions } from '@/styles/theme';

export const SignaturesBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Sits above the fields rather than beside them, because it explains why they are
// outlined in red (main, Edit.tsx:4305).
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

// Both header buttons are tinted rather than plain icon buttons: they carry words,
// and the signatures topic is the one place in the sheet where the heading row
// holds actions instead of the action row.
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

// Dashed and unfilled, which is main's way of marking the one that adds another of
// something rather than acting on what is there.
export const AddSignatureBtn = styled(HeaderBtn)`
  border: 1px dashed ${docColors.primaryLightBorder};

  &:hover {
    background-color: ${colors.primaryLight};
  }
`;
