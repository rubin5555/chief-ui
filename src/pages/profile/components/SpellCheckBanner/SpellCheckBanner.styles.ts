import styled from 'styled-components';
import { flexCenter, flexGap } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const BannerRoot = styled.div`
  margin-top: auto;
  padding: 14px 16px;
  ${flexGap(12)}
  background-color: transparent;
  border: 1px solid ${gray[200]};
  border-radius: ${radii['2xl']};
`;

export const BannerIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radii.xl};
  background-color: ${gray[50]};
  ${flexCenter}
  flex-shrink: 0;
  color: ${colors.primary};
`;

export const BannerText = styled.div`
  flex: 1;
  text-align: right;
`;

export const BannerTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${gray[900]};
  margin: 0;
`;

export const BannerSub = styled.p`
  font-size: 11px;
  color: ${gray[400]};
  margin: 2px 0 0 0;
`;
