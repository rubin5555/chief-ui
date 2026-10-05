import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const PanelContainer = styled.div<{ $accentColor: string }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-top: 4px solid ${({ $accentColor }) => $accentColor};
  border-radius: ${radii.xl};
  box-shadow: ${shadows.md};
  overflow: hidden;
  direction: rtl;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: ${gray[50]};
  border-bottom: 1px solid ${colors.border};
`;

export const UserIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled.div<{ $accentColor: string }>`
  width: 38px;
  height: 38px;
  border-radius: ${radii.full};
  background: ${({ $accentColor }) => $accentColor};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

export const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${gray[900]};
`;

export const UserRole = styled.span`
  font-size: 11.5px;
  color: ${gray[500]};
`;

export const StatusPill = styled.div<{ $connected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: ${radii.full};
  background: ${({ $connected }) =>
    $connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $connected }) => ($connected ? '#059669' : '#dc2626')};
  border: 1px solid
    ${({ $connected }) => ($connected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)')};
`;

export const StatusDot = styled.span<{ $connected: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: ${radii.full};
  background: ${({ $connected }) => ($connected ? '#10b981' : '#ef4444')};
  box-shadow: ${({ $connected }) => ($connected ? '0 0 6px #10b981' : 'none')};
`;

export const ToolbarSlot = styled.div`
  padding: 8px 14px;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${gray[100]};
  flex: 1;
  overflow-y: auto;
`;

export const SectionCard = styled.div<{ $isHeldByMe: boolean; $isHeldByOther: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${colors.surface};
  border: 1.5px solid
    ${({ $isHeldByMe, $isHeldByOther }) =>
      $isHeldByMe ? colors.primary : $isHeldByOther ? colors.accent : colors.border};
  border-radius: ${radii.lg};
  overflow: hidden;
  box-shadow: ${shadows.sm};
  transition: all ${transitions.normal};
`;

export const SectionCardHeader = styled.div<{ $isHeldByMe: boolean; $isHeldByOther: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${({ $isHeldByMe, $isHeldByOther }) =>
    $isHeldByMe
      ? 'color-mix(in srgb, var(--color-primary-light) 30%, var(--color-surface))'
      : $isHeldByOther
        ? 'color-mix(in srgb, var(--color-accent) 10%, var(--color-surface))'
        : gray[50]};
  border-bottom: 1px solid ${colors.border};
`;

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${gray[800]};
`;

export const SectionActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LockStateBadge = styled.span<{ $type: 'mine' | 'other' | 'free' }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: ${radii.full};
  background: ${({ $type }) =>
    $type === 'mine'
      ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
      : $type === 'other'
        ? 'color-mix(in srgb, var(--color-accent) 15%, transparent)'
        : gray[200]};
  color: ${({ $type }) =>
    $type === 'mine' ? colors.primary : $type === 'other' ? colors.accent : gray[600]};
`;

export const ReleaseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: ${radii.md};
  background: ${colors.dangerLight};
  color: ${colors.danger};
  border: 1px solid ${colors.danger};
  cursor: pointer;
  transition: all ${transitions.fast};

  &:hover {
    background: ${colors.danger};
    color: ${colors.surface};
  }
`;

export const EditorArea = styled.div`
  padding: 12px;
`;
