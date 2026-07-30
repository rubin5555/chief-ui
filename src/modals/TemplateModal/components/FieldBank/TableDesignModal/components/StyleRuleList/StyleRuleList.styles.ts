import styled from 'styled-components';
import { dashedActionButton, flexFill, flexGap } from '@/styles/mixins';
import { DesignBlockHeader } from '../../TableDesignModal.styles';

export {
  DesignBlock as Block,
  DesignListWrap as ListWrap,
  DesignRemoveBtn as RemoveBtn,
} from '../../TableDesignModal.styles';

export const BlockHeader = styled(DesignBlockHeader)`
  align-items: flex-start;
  gap: 8px;
`;

export const ConditionRow = styled.div`
  ${flexGap(6)}
  flex: 1;
  min-width: 0;

  > * {
    ${flexFill}
  }
`;

export const AddRuleBtn = styled.button`
  ${dashedActionButton}
  width: 100%;
  justify-content: center;
  padding: 6px 12px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
