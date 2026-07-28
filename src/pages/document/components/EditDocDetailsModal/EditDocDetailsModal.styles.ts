import styled from 'styled-components';
import { colors, docStatusColors, gray, radii } from '@/styles/theme';

export const Body = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 12px;

  > * {
    flex: 1;
  }
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${gray[700]};
`;

// Red-bordered until a duplicate has been renamed, which is the only state where
// a field is wrong before anyone has touched it (main, Edit.tsx:2289).
export const NameInput = styled.input<{ $needsRename?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border-radius: ${radii.lg};
  border: 1px solid
    ${({ $needsRename }) => ($needsRename ? docStatusColors.fix : colors.border)};
  background-color: ${gray[50]};
  font-size: 13px;
  color: ${gray[800]};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const DirtyWarning = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: ${radii.lg};
  background-color: ${colors.warningLight};
  color: ${colors.warning};
  font-size: 12px;
  line-height: 1.6;
`;

/** The hint beside the label, not under the field: it qualifies the label's demand. */
export const FieldHint = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: ${docStatusColors.fix};
`;

export const LabelRow = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/**
 * What a field becomes once the document is past editing. A span rather than a
 * disabled input: on a document that has been distributed these are printed
 * facts, and a greyed-out control still reads as something that might be enabled.
 */
export const ReadOnlyValue = styled.span`
  padding: 8px 0;
  font-size: 13px;
  color: ${gray[700]};
`;
