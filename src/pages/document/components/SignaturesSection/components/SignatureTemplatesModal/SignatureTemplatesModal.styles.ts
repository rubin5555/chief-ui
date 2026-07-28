import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
`;

// Hairline dividers between rows and none after the last: a list of choices, not a
// stack of cards.
export const TemplateRow = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  text-align: right;
  border-bottom: 1px solid ${gray[50]};
  transition: background-color ${transitions.normal};

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const TemplateIcon = styled.span`
  ${flexCenter}
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: ${radii.xl};
  background-color: ${colors.primaryLight};
  color: ${colors.primary};
`;

export const TemplateName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${gray[800]};
`;
