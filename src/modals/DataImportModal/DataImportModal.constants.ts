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

// No backend yet — mock catalog mirroring the source-system hierarchy the picker browses.
export const SOURCE_SYSTEMS: SourceSystem[] = [
  {
    id: 'sys1',
    name: 'UniTree',
    operations: [
      {
        id: 'op1',
        name: 'הבאת יחידת אב',
        instances: [
          'יחידה 101',
          'יחידה 202',
          'יחידה 303',
          'יחידה 404',
          'יחידה 505',
          'יחידה 606',
          'יחידה 707',
          'יחידה 808',
          'יחידה 900',
          'יחידה 1001',
          'יחידה צפון א׳',
          'יחידה צפון ב׳',
          'יחידה דרום א׳',
          'יחידה דרום ב׳',
          'יחידה מרכז',
        ],
        fields: ['שם היחידה', 'מספר יחידה', 'מפקד היחידה', 'כתובת היחידה', 'סוג היחידה'],
      },
      {
        id: 'op2',
        name: 'הבאת פרטי כוח אדם',
        instances: [
          'יחידה 101',
          'יחידה 202',
          'יחידה 303',
          'יחידה 404',
          'יחידה 505',
          'יחידה 606',
          'יחידה 707',
          'יחידה 808',
          'יחידה 900',
          'יחידה 1001',
        ],
        fields: ['מספר חיילים', 'מספר קצינים', 'שם קצין הכוננות', 'כוח זמין'],
      },
    ],
  },
  {
    id: 'sys2',
    name: 'Ganttit',
    operations: [
      {
        id: 'op3',
        name: 'הבאת פרטי פעולה',
        instances: [
          'מבצע שחר',
          'מבצע ברק',
          'מבצע סערה',
          'מבצע חרב',
          'מבצע מגן',
          'מבצע נשר',
          'מבצע אריה',
          'מבצע כוח',
          'מבצע מים',
          'מבצע רוח',
          'מבצע אש',
          'מבצע ענן',
        ],
        fields: ['שם הפעולה', 'תאריך הפעולה', 'איזור הפעולה', 'מטרת הפעולה', 'שעת כניסה'],
      },
      {
        id: 'op4',
        name: 'הבאת פרטי איום',
        instances: [
          'איום צפון 1',
          'איום צפון 2',
          'איום דרום 1',
          'איום דרום 2',
          'איום מרכז 1',
          'איום מרכז 2',
          'איום מזרח 1',
          'איום מערב 1',
        ],
        fields: ['סוג האיום', 'מיקום האיום', 'עוצמת כוח'],
      },
    ],
  },
  {
    id: 'sys3',
    name: 'LineApp',
    operations: [
      {
        id: 'op5',
        name: 'הבאת נתוני ציוד',
        instances: [
          'מחסן ראשי א׳',
          'מחסן ראשי ב׳',
          'מחסן שדה 1',
          'מחסן שדה 2',
          'מחסן שדה 3',
          'מחסן שדה 4',
          'מחסן מובייל א׳',
          'מחסן מובייל ב׳',
          'מחסן חירום צפון',
          'מחסן חירום דרום',
        ],
        fields: ['כמות כלי רכב', 'כמות נשק', 'מלאי תחמושת', 'ציוד רפואי'],
      },
      {
        id: 'op6',
        name: 'הבאת פרטי אחסון',
        instances: [
          'מחסן ראשי א׳',
          'מחסן ראשי ב׳',
          'מחסן שדה 1',
          'מחסן שדה 2',
          'מחסן שדה 3',
          'מחסן מובייל א׳',
          'מחסן חירום',
        ],
        fields: ['מיקום מחסן', 'שם אחראי', 'תאריך עדכון אחסון'],
      },
    ],
  },
];

// Fields that expand to show optional sub-fields in the fields column.
export const FIELD_CHILDREN: Record<string, string[]> = {
  'שם היחידה': ['שם מלא', 'שם קצר', 'שם בעברית'],
  'מפקד היחידה': ['דרגה', 'שם פרטי', 'שם משפחה'],
};

export const NAME_SEARCH_OPTIONS = [
  'אבי כהן',
  'שרה לוי',
  'משה ישראלי',
  'רחל דוד',
  'יוסף מזרחי',
  'מירי פרץ',
  'דני אברהם',
  'לאה כץ',
  'אורן שמש',
  'נועה גרין',
  'יעקב בן-דוד',
  'תמר ברק',
  'עמי שלו',
  'ריקי נחום',
  'גיל אלון',
];
