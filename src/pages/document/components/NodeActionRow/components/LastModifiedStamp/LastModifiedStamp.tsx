import type { NodeStamp } from '../../../../types';
import { Stamp } from './LastModifiedStamp.styles';
import { LAST_MODIFIED_STAMP_IDS } from './LastModifiedStamp.testids';

export interface LastModifiedStampProps {
  nodeId: string;
  stamp: NodeStamp;
}

// "עודכן ב-25-06-2026 11:18 ע״י s2345678" — who last touched this node, and when
// (main, Edit.tsx:4265).
//
// The date arrives pre-formatted from the API rather than being built from a
// Date here: it is a display string in the document's own convention, and
// reformatting it would be inventing a format the rest of the document doesn't
// use.
export const LastModifiedStamp = ({ nodeId, stamp }: LastModifiedStampProps) => (
  <Stamp data-testid={LAST_MODIFIED_STAMP_IDS.root(nodeId)}>
    עודכן ב‏{stamp.at} ע״י {stamp.by}
  </Stamp>
);
