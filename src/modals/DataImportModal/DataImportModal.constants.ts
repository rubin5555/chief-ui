export interface SourceOperation {
  id: string;
  name: string;
  instances: string[];
  fields: string[];
}

export interface SourceSystem {
  id: string;
  name: string;
  operations: SourceOperation[];
}

// A field the user linked from a source system into the template.
export interface DynamicField {
  id: string;
  systemId: string;
  systemName: string;
  operationId: string;
  operationName: string;
  instanceName: string;
  fieldName: string;
}

export interface OperationParamValues {
  name: string;
  date: string;
  quantity: string;
  question: boolean;
}

export const EMPTY_OPERATION_PARAMS: OperationParamValues = {
  name: '',
  date: '',
  quantity: '',
  question: false,
};

export const MODAL_TITLE = 'ייבוא ממערכת מקור';
