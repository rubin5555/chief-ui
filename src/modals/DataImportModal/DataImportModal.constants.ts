import type { CellStyle, JsonValue } from "@/lib/json-table";

export const ENABLE_TABLE_DESIGN = true;

export type FieldShape = "table" | "list" | "text";

export type SourceFieldValue = JsonValue;

export interface SourceField {
	name: string;
	value: SourceFieldValue;
}

export interface SourceOperation {
	id: string;
	name: string;
	instances: string[];
	fields: SourceField[];
}

export interface SourceSystem {
	id: string;
	name: string;
	operations: SourceOperation[];
}

export type StyleTarget = "header" | "subheader" | "key" | "cell" | "caption";

export type RuleOperator =
	| "eq"
	| "neq"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "contains";

export interface StyleRule {
	id: string;
	column: string;
	operator: RuleOperator;
	value: string;
	style: CellStyle;
}

export interface TableDesignOptions {
	caption?: string;
	totals?: boolean;
	aggregate?: string[];
	rowTitleField?: string;
	labels?: Record<string, string>;
	targetStyles?: Partial<Record<StyleTarget, CellStyle>>;
	columnStyles?: Record<string, CellStyle>;
	rules?: StyleRule[];
}

export interface DynamicField {
	id: string;
	systemId: string;
	systemName: string;
	operationId: string;
	operationName: string;
	instanceName: string;
	fieldName: string;
	shape: FieldShape;
	value: SourceFieldValue;
	ordered?: boolean;
	renderAsTable?: boolean;
	tableDesign?: TableDesignOptions;
}

export interface OperationParamValues {
	name: string;
	date: string;
	quantity: string;
	question: boolean;
}

export const EMPTY_OPERATION_PARAMS: OperationParamValues = {
	name: "",
	date: "",
	quantity: "",
	question: false,
};

export const MODAL_TITLE = "ייבוא ממערכת מקור";
