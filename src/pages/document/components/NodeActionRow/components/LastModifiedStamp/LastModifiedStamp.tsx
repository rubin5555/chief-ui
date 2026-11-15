import type { NodeStamp } from '../../../../types';
import { Stamp } from './LastModifiedStamp.styles';
import { LAST_MODIFIED_STAMP_IDS } from './LastModifiedStamp.testids';

export interface LastModifiedStampProps {
  nodeId: string;
  stamp: NodeStamp;
}

export const LastModifiedStamp = ({ nodeId, stamp }: LastModifiedStampProps) => (
  <Stamp data-testid={LAST_MODIFIED_STAMP_IDS.root(nodeId)}>
    עודכן ב‏{stamp.at} ע״י {stamp.by}
  </Stamp>
);
