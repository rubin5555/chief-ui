export type ApprovalFlowStep =
  | 'idle'
  | 'review'
  | 'dirtyWarning'
  | 'details'
  | 'rotation'
  | 'distributeConfirm'
  | 'distribute'
  | 'acceptance';
