/**
 * Where the approval flow is.
 *
 * `review` is main's approval-mode details dialog, which comes before the round is
 * configured; `dirtyWarning` is the question it raises if the document's values
 * were edited on the way through; `distributeConfirm` is the question in front of
 * the share dialog, and `distribute` is that dialog.
 *
 * Its own module so ApprovalWorkflow and the component that renders the step's
 * dialog can both name it without one importing the other.
 */
export type ApprovalFlowStep =
  | 'idle'
  | 'review'
  | 'dirtyWarning'
  | 'details'
  | 'rotation'
  | 'distributeConfirm'
  | 'distribute'
  | 'acceptance';
