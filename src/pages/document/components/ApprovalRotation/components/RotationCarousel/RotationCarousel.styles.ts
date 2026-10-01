import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 64px;
`;

export const TimelineDot = styled.span<{ $state: 'approved' | 'active' | 'idle' }>`
  width: 14px;
  height: 14px;
  border-radius: ${radii.full};
  background-color: ${(props) =>
    props.$state === 'approved'
      ? colors.accent
      : props.$state === 'active'
        ? colors.primary
        : gray[300]};
`;

export const TimelineLabel = styled.span<{ $state: 'approved' | 'active' | 'idle' }>`
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  color: ${(props) =>
    props.$state === 'approved'
      ? colors.accent
      : props.$state === 'active'
        ? colors.primary
        : gray[400]};
`;

export const TimelineConnector = styled.div`
  flex: 1;
  height: 1px;
  min-width: 16px;
  background-color: ${colors.border};
`;

export const HmlList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const HmlChip = styled.span`
  padding: 3px 10px;
  border-radius: ${radii.full};
  background-color: ${gray[50]};
  color: ${gray[600]};
  font-size: 11px;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: ${radii.xl};
  border: 1px solid ${colors.border};
`;

export const CarouselHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CarouselNavBtn = styled.button`
  display: flex;
  padding: 4px;
  border: none;
  background: none;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const CarouselTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const StageLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${gray[800]};
`;

export const UserLabel = styled.span`
  font-size: 10px;
  color: ${gray[400]};
`;

export const PageDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  padding-top: 4px;
`;

export const PageDot = styled.span<{ $active: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: ${radii.full};
  background-color: ${({ $active }) => ($active ? colors.primary : gray[300])};
  transition: background-color ${transitions.normal};
`;

export const FixNoteLink = styled.button`
  ${resetButton}
  align-self: flex-start;
  font-size: 11px;
  color: ${colors.primary};
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    opacity: 0.75;
  }
`;
