export const SIGNATURE_TEXTAREA_IDS = {
  // Indexed, because a signature is a slot in the block rather than a record with
  // an identity — main's are a plain string[].
  field: (index: number) => `signature-textarea-${index}`,
};
