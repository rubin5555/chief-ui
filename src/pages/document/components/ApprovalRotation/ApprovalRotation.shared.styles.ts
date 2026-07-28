import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

// The two parts more than one of this modal's views needs. Everything else moved
// into the view that owns it — see each `components/*/`.

/**
 * The notes field, used by the carousel (an approver's remarks) and by the reject
 * form (the reason). One style because they are the same control asked for
 * different text, and a reject reason that looked different from a note would
 * imply it was.
 */
export const Notes = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 10px 12px;
  border-radius: ${radii.lg};
  border: 1px solid ${colors.border};
  font-size: 13px;
  color: ${gray[800]};
  resize: none;

  &:focus {
    outline: none;
  }
`;

/** Button row, in the modal footer for the carousel and inline for the other two views. */
export const FooterActions = styled.div`
  display: flex;
  gap: 10px;
`;
