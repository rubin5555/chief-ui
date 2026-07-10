import { gql } from '@apollo/client';
import type { SourceSystem } from '@/modals/DataImportModal';
import { registerStub } from './stubLink';

export const GET_SOURCE_SYSTEMS_QUERY = gql`
  query GetSourceSystems {
    sourceSystems {
      id
      name
      operations {
        id
        name
        instances
        fields
      }
    }
  }
`;

export interface GetSourceSystemsResult {
  sourceSystems: SourceSystem[];
}

// ponytail: no backend/resolver yet — registered on stubLink with the same
// mock catalog DataImportModal used to import directly. Delete this
// registration once GetSourceSystems has a real resolver; call sites don't
// change.
export const SOURCE_SYSTEMS_FALLBACK: GetSourceSystemsResult = {
  sourceSystems: [
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
  ],
};

registerStub('GetSourceSystems', (): GetSourceSystemsResult => SOURCE_SYSTEMS_FALLBACK);
