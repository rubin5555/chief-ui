import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const FaqHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 8px;
  flex-shrink: 0;
`;

export const FaqBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 9999px;
  transition: background-color 0.15s;
  &:hover { background-color: ${gray[100]}; }
`;

export const FaqTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${gray[900]};
`;

export const FaqList = styled.div`
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const FaqItem = styled.div`
  border: 1px solid ${colors.border};
  border-radius: ${radii.xl};
  overflow: hidden;
`;

export const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  text-align: right;
  transition: background-color 0.15s;
  &:hover { background-color: ${gray[50]}; }
`;

export const FaqQuestionLabel = styled.span`
  font-size: 14px;
  color: ${gray[700]};
`;

export const FaqAnswer = styled.p`
  padding: 12px 16px;
  background: ${gray[50]};
  border-top: 1px solid ${colors.border};
  font-size: 14px;
  color: ${gray[600]};
`;
