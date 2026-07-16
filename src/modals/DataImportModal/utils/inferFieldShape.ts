import type { FieldShape, SourceFieldValue } from '../DataImportModal.constants';

const isPlainObject = (value: SourceFieldValue): value is { [key: string]: SourceFieldValue } =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Array of objects -> table, array of primitives -> list, anything else -> plain text.
export const inferFieldShape = (value: SourceFieldValue): FieldShape => {
  if (!Array.isArray(value)) return 'text';
  return value.length > 0 && value.every(isPlainObject) ? 'table' : 'list';
};
