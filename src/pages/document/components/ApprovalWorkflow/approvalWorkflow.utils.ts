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

/**
 * What the forward button says, or `null` when there is no forward step to offer.
 *
 * Pure and separate from the component because it is a decision table, not
 * rendering: four statuses, each with its own wording, and one of them (`בסבב
 * אישורים`) where "forward" means opening the round rather than leaving it.
 */
export const getAdvanceLabel = (status: string, canStep: boolean): string | null => {
  if (status === 'ממתין להפצה') return 'הפץ מסמך';
  const next = getNextStatus(status);
  if (!canStep || !next) return null;
  if (status === 'בסבב אישורים') return 'אישור/דחיית המסמך';
  if (next === 'בסבב אישורים') return 'העבר לסבב אישורים';
  return `העבר ל${next}`;
};

/** What the back button says, or `null` when there is nowhere back to go. */
export const getRevertLabel = (status: string, canStep: boolean): string | null => {
  if (status === 'ממתין להפצה') return 'החזר לעריכה';
  const prev = getPrevStatus(status);
  if (!canStep || !prev) return null;
  if (status === 'בסבב אישורים') return 'החזר לעריכה';
  return `החזר למסמך ${prev}`;
};
