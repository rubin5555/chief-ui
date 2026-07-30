import styled from 'styled-components';
import { flexBetween, flexColumn, flexGap, resetButton, rtlTextInput } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export const PanelHeader = styled.div`
  ${flexBetween}
  padding: 14px 16px 8px;
  border-bottom: 1px solid ${gray[100]};
`;

export const PanelTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const CloseButton = styled.button`
  ${resetButton}
  display: flex;
  padding: 4px;
  border-radius: ${radii.full};
  color: ${gray[400]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[100]};
  }
`;

export const PanelBody = styled.div`
  ${flexColumn(10)}
  padding: 12px 16px;
`;

export const SearchRow = styled.div`
  ${flexGap(6)}
`;

export const InputShell = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  transition: border-color ${transitions.normal};

  &:focus-within {
    border-color: ${colors.primary};
  }
`;

export const SearchIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  margin: 0 8px;
  color: ${gray[300]};
`;

export const PanelInput = styled.input`
  ${rtlTextInput}
  flex: 1;
  min-width: 0;
  padding: 8px 4px 8px 8px;
  font-size: 12px;
  border: none;
  outline: none;
  background: transparent;
  color: ${gray[700]};
`;

export const StepButton = styled.button`
  ${resetButton}
  display: flex;
  padding: 6px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: background ${transitions.normal}, color ${transitions.normal};

  &:hover {
    background: ${gray[100]};
    color: ${gray[600]};
  }
`;

// A permanent label rather than a placeholder: the box below the search field
// would otherwise be indistinguishable from it once something is typed in.
export const ReplaceLabel = styled.span`
  flex-shrink: 0;
  padding: 8px 10px;
  font-size: 11px;
  user-select: none;
  color: ${gray[400]};
  background: ${docColors.surfaceSubtle};
  border-left: 1px solid ${gray[100]};
`;

export const PanelFooter = styled.div`
  ${flexGap(8)}
  padding: 2px 16px 14px;
  border-top: 1px solid ${gray[100]};

  > button {
    flex: 1;
    justify-content: center;
  }
`;
