import styled from 'styled-components';
import { ellipsis, flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: ${gray[400]};
`;

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  background-color: ${gray[50]};
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const FileIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${colors.primary};
`;

export const FileName = styled.span`
  ${ellipsis}
  font-size: 14px;
  color: ${gray[700]};
`;

export const FileSize = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  color: ${gray[400]};
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const RowBtn = styled.button`
  ${resetButton}
  ${flexCenter}
  padding: 6px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: all ${transitions.normal};
`;

// Lifts off the row's grey fill on hover, which is what tells you the row's
// buttons are separate targets from the row itself.
export const DownloadBtn = styled(RowBtn)`
  &:hover:not(:disabled) {
    background-color: ${colors.surface};
    box-shadow: ${shadows.sm};
    color: ${colors.primary};
  }

  &:disabled {
    color: ${gray[300]};
    cursor: not-allowed;
  }
`;

// The one destructive control in this dialog, and the only place it turns red —
// on hover, not at rest, so the row doesn't read as a warning.
export const DeleteBtn = styled(RowBtn)`
  &:hover {
    background-color: ${colors.dangerLight};
    color: ${colors.danger};
  }
`;

// Grey rather than the navy of `dashedActionButton`, which is main's treatment
// here (Edit.tsx:4886): adding a second file is a continuation of what you were
// already doing, not the dialog's primary action — that is the footer's `סיום`.
export const AddMoreBtn = styled.button`
  ${resetButton}
  ${flexCenter}
  gap: 6px;
  padding: 10px 16px;
  margin-top: 4px;
  border: 1px dashed ${gray[200]};
  border-radius: ${radii.xl};
  font-size: 14px;
  font-weight: 500;
  color: ${gray[500]};
  transition: background-color ${transitions.normal}, border-color ${transitions.normal};

  &:hover {
    background-color: ${gray[50]};
    border-color: ${gray[300]};
  }
`;
