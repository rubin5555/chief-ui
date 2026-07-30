import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const FieldsRow = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 12px;
  /* Hex and RGB are read left-to-right regardless of the page's direction. */
  direction: ltr;
`;

export const Field = styled.div<{ $grow: number }>`
  flex: ${({ $grow }) => $grow};
`;

export const FieldLabel = styled.span`
  display: block;
  margin-bottom: 3px;
  font-size: 10px;
  text-align: center;
  color: ${gray[400]};
`;

export const HexShell = styled.div`
  display: flex;
  align-items: center;
  padding-right: 5px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.md};
  background: ${colors.surface};
`;

export const HexHash = styled.span`
  font-size: 11px;
  color: ${gray[400]};
`;

export const HexInput = styled.input`
  flex: 1;
  width: 0;
  padding: 5px 3px;
  font-size: 11px;
  border: none;
  outline: none;
  background: transparent;
  color: ${gray[700]};
`;

export const ChannelInput = styled.input`
  width: 100%;
  padding: 5px 3px;
  font-size: 11px;
  text-align: center;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.md};
  outline: none;
  background: ${colors.surface};
  color: ${gray[700]};
`;
