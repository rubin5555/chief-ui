import styled from 'styled-components';
import { flexCenter, flexGap, navIconAction } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const ToolbarRoot = styled.div`
  ${flexGap(4)}
  margin-right: 4px;
`;

export const IconAction = styled.button`
  ${navIconAction}
`;

export const Divider = styled.span`
  width: 1px;
  height: 16px;
  background: ${gray[200]};
  margin: 0 2px;
`;

export const ZoomControlRoot = styled.div`
  display: flex;
  align-items: center;
`;

export const ZoomButton = styled.button`
  width: 24px;
  height: 24px;
  ${flexCenter}
  border-radius: ${radii.full};
  transition: background-color 0.15s;
  color: ${gray[600]};
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  user-select: none;
  &:hover { background-color: ${gray[100]}; }
`;

/*
 * The zoom readout, which is also how you set the zoom: main only offers −/+
 * (TopNavbar.tsx:1314), so getting from 100% to 175% is eight presses.
 *
 * `direction: ltr` because "100%" is a number followed by its unit and has to
 * stay in that order on this RTL page. The width is main's `w-10`, held on the
 * group rather than the field so the −/+ buttons either side don't shift as the
 * number grows a digit.
 */
export const ZoomValueGroup = styled.label`
  ${flexCenter}
  direction: ltr;
  width: 40px;
  border-radius: ${radii.sm};
  &:focus-within {
    outline: 2px solid ${colors.primary};
    outline-offset: 1px;
  }
`;

export const ZoomField = styled.input`
  /* No border and no box of its own: this reads as the label it replaced, and
     the group above is what answers focus. */
  border: none;
  background: transparent;
  padding: 0;
  width: 24px;
  font-size: 12px;
  color: ${gray[600]};
  text-align: right;
  font-variant-numeric: tabular-nums;
  &:focus {
    outline: none;
  }
`;

export const ZoomUnit = styled.span`
  font-size: 12px;
  color: ${gray[600]};
`;

/*
 * The pill, not the input inside it, is what shows focus. The input is a
 * transparent field with no edge of its own, so a ring around it would trace a
 * rectangle floating inside a rounded pill; the pill is the control as far as
 * anyone looking at it is concerned.
 *
 * `:focus-within` rather than `:focus-visible` on the input: this field is
 * auto-focused the moment it opens, and a search box that gives no sign it is
 * ready to be typed into is the thing being fixed here.
 */
export const SearchField = styled.div`
  ${flexGap(6)}
  background: ${gray[100]};
  border-radius: ${radii.full};
  padding: 4px 12px;
  &:focus-within {
    outline: 2px solid ${colors.primary};
    outline-offset: 1px;
  }
`;

export const SearchFieldInput = styled.input`
  font-size: 12px;
  /* An input keeps the browser's inset border unless it is told not to — main
     never sees this because Tailwind's preflight zeroes it globally. Without it
     there is a second, boxy edge drawn inside the pill. */
  border: none;
  background: transparent;
  /* Focus is drawn by SearchField above, once, around the whole pill. */
  outline: none;
  width: 128px;
  text-align: right;
  color: ${gray[700]};
  &::placeholder { color: ${gray[400]}; }
`;

export const SearchCloseButton = styled.button`
  padding: 2px;
  border-radius: ${radii.full};
  transition: background-color 0.15s;
  ${flexCenter}
  &:hover { background-color: ${gray[200]}; }
`;

export const SpinningLoader = styled.span`
  display: inline-flex;
  animation: spin 1s linear infinite;
  color: ${colors.primary};
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
