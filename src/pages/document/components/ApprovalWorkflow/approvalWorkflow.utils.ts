import { STATUS_FLOW } from '../../document.constants';

/**
 * The status one step forward, or `null` at the end of the flow.
 *
 * A status outside STATUS_FLOW — `טיוטה`, which is what the seed document
 * carries, plus every terminal state — has no position in it, so "forward" means
 * entering the flow at its first step. main lands on the same behaviour by
 * accident (`indexOf` returns -1 and `STATUS_FLOW[-1 + 1]` is the first entry);
 * it is written out here because it is the seed document's actual first button,
 * not an edge case nobody sees.
 */
export const getNextStatus = (status: string): string | null => {
  const index = STATUS_FLOW.indexOf(status);
  if (index === -1) return STATUS_FLOW[0];
  return index < STATUS_FLOW.length - 1 ? STATUS_FLOW[index + 1] : null;
};

/**
 * The status one step back, or `null` when there is none. Note the asymmetry
 * with getNextStatus: an off-flow status can step *into* the flow but has
 * nothing to step back to, so a `טיוטה` document shows one button, not two.
 */
export const getPrevStatus = (status: string): string | null => {
  const index = STATUS_FLOW.indexOf(status);
  return index > 0 ? STATUS_FLOW[index - 1] : null;
};
