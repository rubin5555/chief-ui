import styled from 'styled-components';
import { gray, radii } from '@/styles/theme';

export const Intro = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${gray[500]};
`;

export const SystemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

export const SystemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 16px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  background-color: ${gray[50]};
`;

export const SystemName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const SystemField = styled.span`
  font-size: 11px;
  color: ${gray[500]};
`;
