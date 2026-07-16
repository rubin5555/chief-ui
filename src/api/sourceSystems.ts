import { gql } from '@apollo/client';
import type { SourceSystem } from '@/modals/DataImportModal';
import { useApiQuery } from './hooks';
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
        fields {
          name
          value
        }
      }
    }
  }
`;

export interface GetSourceSystemsResult {
  sourceSystems: SourceSystem[];
}

export const useSourceSystems = () =>
  useApiQuery(GET_SOURCE_SYSTEMS_QUERY, (result: GetSourceSystemsResult) => result.sourceSystems);

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
          fields: [
            { name: 'שם היחידה', value: 'יחידה 101' },
            { name: 'מספר יחידה', value: '101' },
            { name: 'מפקד היחידה', value: 'אל"מ דוד כהן' },
            { name: 'כתובת היחידה', value: 'בסיס צפון, אזור תעשייה 5' },
            { name: 'סוג היחידה', value: 'יחידה קרבית' },
          ],
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
          fields: [
            { name: 'מספר חיילים', value: '120' },
            { name: 'מספר קצינים', value: '8' },
            { name: 'שם קצין הכוננות', value: 'סרן יוסי לוי' },
            { name: 'כוח זמין', value: [45, 30, 25] },
          ],
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
          fields: [
            { name: 'שם הפעולה', value: 'מבצע שחר' },
            { name: 'תאריך הפעולה', value: '16.07.2026' },
            { name: 'איזור הפעולה', value: 'גזרה צפונית' },
            { name: 'מטרת הפעולה', value: 'אבטחת ציר תנועה' },
            { name: 'שעת כניסה', value: '04:30' },
          ],
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
          fields: [
            { name: 'סוג האיום', value: 'חדירה' },
            { name: 'מיקום האיום', value: 'גבול צפון' },
            { name: 'עוצמת כוח', value: 'בינונית' },
          ],
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
          fields: [
            {
              name: 'כמות כלי רכב',
              value: [
                { סוג: "ג'יפ", כמות: 5 },
                { סוג: 'משאית', כמות: 3 },
                { סוג: 'נגמ"ש', כמות: 2 },
              ],
            },
            { name: 'כמות נשק', value: '230' },
            { name: 'מלאי תחמושת', value: [4000, 1200, 300] },
            { name: 'ציוד רפואי', value: 'ציוד עזרה ראשונה מלא' },
          ],
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
          fields: [
            { name: 'מיקום מחסן', value: 'מחסן ראשי א׳' },
            { name: 'שם אחראי', value: 'רס"ן איתי שגיא' },
            { name: 'תאריך עדכון אחסון', value: '10.07.2026' },
          ],
        },
      ],
    },
  ],
};

registerStub('GetSourceSystems', (): GetSourceSystemsResult => SOURCE_SYSTEMS_FALLBACK);
