import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const DemoPageRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 56px);
  padding: 24px;
  gap: 20px;
  background: ${gray[50]};
  direction: rtl;
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
`;

export const DemoHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radii.xl};
  padding: 20px 24px;
  box-shadow: ${shadows.sm};
`;

export const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DemoTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: ${gray[900]};
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DemoSubtitle = styled.p`
  margin: 0;
  font-size: 13.5px;
  color: ${gray[600]};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ResetBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: ${radii.lg};
  background: ${gray[100]};
  color: ${gray[800]};
  border: 1px solid ${gray[300]};
  cursor: pointer;
  transition: all ${transitions.fast};

  &:hover {
    background: ${gray[200]};
  }
`;

export const ModeSwitchBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: ${radii.lg};
  cursor: pointer;
  transition: all ${transitions.fast};
  background: ${({ $active }) => ($active ? '#2563eb' : gray[100])};
  color: ${({ $active }) => ($active ? '#ffffff' : gray[800])};
  border: 1px solid ${({ $active }) => ($active ? '#1d4ed8' : gray[300])};

  &:hover {
    background: ${({ $active }) => ($active ? '#1d4ed8' : gray[200])};
  }
`;

export const FeaturePillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid ${colors.border};
`;

export const FeaturePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${gray[700]};
  background: ${gray[100]};
  padding: 4px 10px;
  border-radius: ${radii.full};
  border: 1px solid ${gray[200]};
`;

export const ServerAlertBanner = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: ${radii.lg};
  background: ${({ $connected }) =>
    $connected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  border: 1px solid
    ${({ $connected }) => ($connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)')};
  color: ${({ $connected }) => ($connected ? '#047857' : '#b91c1c')};
  font-size: 13px;
  gap: 12px;
`;

export const ServerAlertText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CodeSnippet = styled.code`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  background: ${gray[200]};
  color: ${gray[900]};
  padding: 2px 6px;
  border-radius: ${radii.sm};
  direction: ltr;
  display: inline-block;
`;

export const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
