export interface DemoSectionDef {
  id: string;
  title: string;
  defaultContent: string;
}

export interface DemoUserDef {
  id: string;
  name: string;
  role: string;
  accentColor: string;
}

export const DEMO_SECTIONS: DemoSectionDef[] = [
  {
    id: 'demo-section-1',
    title: 'סעיף 1: מטרות ויעדים מבצעיים',
    defaultContent:
      '<p>מסמך זה מגדיר את <strong>המטרות האסטרטגיות</strong> ומשמש לבדיקת סנכרון בזמן אמת עם TinyEditor.</p><p>נסו ללחוץ על הסעיף באחד הצדדים כדי לרכוש נעילה בלעדית, להקליד ולעצב טקסט.</p>',
  },
  {
    id: 'demo-section-2',
    title: 'סעיף 2: הקצאת כוחות ומשאבים',
    defaultContent:
      '<p>צוות א׳ יפעל בגזרה הצפונית. צוות ב׳ ירכז את המאמץ הלוגיסטי והתקשובי.</p><p>העריכה מתבצעת ברמת סעיף — שני המשתמשים יכולים לערוך <em>סעיפים שונים במקביל!</em></p>',
  },
  {
    id: 'demo-section-3',
    title: 'סעיף 3: טבלת כוחות משימתיים (Massive Data Table & HTML)',
    defaultContent: `
      <p>להלן פירוט סדרי הכוחות המבצעיים, אמצעי לחימה ורמת מוכנות בגזרה (40 יחידות משימתיות בפריסה מלאה):</p>
      <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="text-align: center; width: 35px;">מס״ד</th>
            <th style="text-align: right;">שם הכוח / יחידה</th>
            <th style="text-align: right;">ייעוד טקטי</th>
            <th style="text-align: right;">גזרה מבצעית</th>
            <th style="text-align: right;">מפקד הכוח</th>
            <th style="text-align: center;">סד״כ</th>
            <th style="text-align: center;">כשירות</th>
            <th style="text-align: right;">מלאי דלק</th>
            <th style="text-align: center;">סטטוס מבצעי</th>
          </tr>
        </thead>
        <tbody>
          ${[
            {
              name: 'צוות קרב 401',
              type: 'שריון כבד מרכבה 4',
              sector: 'גזרה צפונית',
              cmd: 'אל״ם דוד כ.',
              qty: 1850,
              readiness: 100,
              fuel: '180,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבת הצנחנים 35',
              type: 'חי״ר מוצנח ונמ״ר',
              sector: 'מרחב מרכזי',
              cmd: 'אל״ם רן ש.',
              qty: 1420,
              readiness: 100,
              fuel: '120,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבת גולני 1',
              type: 'חי״ר כבד נמ״ר',
              sector: 'גזרת חוד מזרח',
              cmd: 'אל״ם אורן ז.',
              qty: 1650,
              readiness: 98,
              fuel: '140,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבת גבעתי 84',
              type: 'חי״ר ואיתן 8x8',
              sector: 'ציר אורך דרומי',
              cmd: 'אל״ם איתי ב.',
              qty: 1580,
              readiness: 97,
              fuel: '135,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבת הנח״ל 933',
              type: 'חי״ר ממוכן',
              sector: 'מרחב בקעה',
              cmd: 'אל״ם יואב ק.',
              qty: 1520,
              readiness: 96,
              fuel: '130,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבה 7 "סער מגולן"',
              type: 'שריון כבד',
              sector: 'צפון מזרח',
              cmd: 'אל״ם עמיר ל.',
              qty: 1720,
              readiness: 99,
              fuel: '175,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבה 188 "ברק"',
              type: 'שריון כבד',
              sector: 'צפון מערב',
              cmd: 'אל״ם גיא נ.',
              qty: 1680,
              readiness: 95,
              fuel: '170,000 ל׳',
              status: 'כשיר מבצעית',
            },
            {
              name: 'חטיבת קומנדו 89',
              type: 'מגלן, דובדבן, אגוז',
              sector: 'עומק האויב',
              cmd: 'אל״ם עומר מ.',
              qty: 850,
              readiness: 100,
              fuel: '65,000 ל׳',
              status: 'בפעולה חשאית',
            },
            {
              name: 'עוצבת גולן 282',
              type: 'ארטילריה תומ״ת רועם',
              sector: 'סיוע אש צפון',
              cmd: 'אל״ם ניר ש.',
              qty: 920,
              readiness: 96,
              fuel: '110,000 ל׳',
              status: 'מוכן לירי',
            },
            {
              name: 'עוצבת עמוד האש 215',
              type: 'ארטילריה ורומח',
              sector: 'סיוע אש דרום',
              cmd: 'אל״ם תומר ע.',
              qty: 890,
              readiness: 98,
              fuel: '105,000 ל׳',
              status: 'מוכן לירי',
            },
            {
              name: 'יחידת יהל״ם חבלה',
              type: 'סילוק פצצות ומנהרות',
              sector: 'חוד הנדסי',
              cmd: 'סא״ל גלעד פ.',
              qty: 320,
              readiness: 100,
              fuel: '45,000 ל׳',
              status: 'בפריצה',
            },
            {
              name: 'פלוגות צמ״ה D9 מובילות',
              type: 'דחפורים ממוגנים',
              sector: 'צירי חוד',
              cmd: 'רס״ן אבנר ט.',
              qty: 240,
              readiness: 92,
              fuel: '85,000 ל׳',
              status: 'בפריצה',
            },
            {
              name: 'טייסת מסק״ר 190',
              type: 'אפאצ׳י AH-64D',
              sector: 'אווירי פיקודי',
              cmd: 'סא״ל תומר כ.',
              qty: 180,
              readiness: 96,
              fuel: '95,000 ל׳',
              status: 'באוויר',
            },
            {
              name: 'טייסת מסק״ר 113',
              type: 'אפאצ׳י AH-64E שרף',
              sector: 'אווירי עומק',
              cmd: 'סא״ל אורן נ.',
              qty: 180,
              readiness: 98,
              fuel: '98,000 ל׳',
              status: 'כוננות זינוק',
            },
            {
              name: 'טייסת מסע״ר 118',
              type: 'יסעור CH-53 פינוי',
              sector: 'מרחב ארצי',
              cmd: 'סא״ל אסף ל.',
              qty: 160,
              readiness: 90,
              fuel: '120,000 ל׳',
              status: 'כוננות פינוי',
            },
            {
              name: 'טייסת כטב״ם 161',
              type: 'הרמס 450 זיק',
              sector: 'תצפית ותקיפה',
              cmd: 'סא״ל ארז מ.',
              qty: 140,
              readiness: 100,
              fuel: '35,000 ל׳',
              status: 'באוויר 24/7',
            },
            {
              name: 'אגד לוגיסטי 650',
              type: 'תובלה כבדה וציוד',
              sector: 'עורף הפיקוד',
              cmd: 'אל״ם ענת ב.',
              qty: 980,
              readiness: 92,
              fuel: '320,000 ל׳',
              status: 'פעיל בצירים',
            },
            {
              name: 'גדוד תקשוב 371',
              type: 'קשר ורשתות שו״ב',
              sector: 'כלל-פיקודי',
              cmd: 'סא״ל יואב ל.',
              qty: 430,
              readiness: 100,
              fuel: '55,000 ל׳',
              status: 'פעיל מבצעית',
            },
            {
              name: 'סוללת כיפת ברזל 1',
              type: 'הגנה אקטיבית',
              sector: 'גליל תחתון',
              cmd: 'רס״ן עמית ס.',
              qty: 85,
              readiness: 100,
              fuel: '18,000 ל׳',
              status: 'כוננות יירוט',
            },
            {
              name: 'סוללת כיפת ברזל 2',
              type: 'הגנה אקטיבית',
              sector: 'עמק יזרעאל',
              cmd: 'רס״ן גיל ק.',
              qty: 85,
              readiness: 100,
              fuel: '18,000 ל׳',
              status: 'כוננות יירוט',
            },
            {
              name: 'סוללת קלע דוד 1',
              type: 'יירוט טווח בינוני',
              sector: 'מרכז פיקודי',
              cmd: 'רס״ן תמר ר.',
              qty: 90,
              readiness: 100,
              fuel: '22,000 ל׳',
              status: 'כוננות יירוט',
            },
            {
              name: 'סוללת חץ 3',
              type: 'יירוט מחוץ לאטמוספירה',
              sector: 'כיסוי ארצי',
              cmd: 'סא״ל יאיר ז.',
              qty: 95,
              readiness: 100,
              fuel: '25,000 ל׳',
              status: 'כוננות יירוט',
            },
            {
              name: 'גדוד חימוש 852',
              type: 'אחזקת רק״ם ותיקון שדה',
              sector: 'סדנאות קדמיות',
              cmd: 'סא״ל רונן ד.',
              qty: 380,
              readiness: 91,
              fuel: '65,000 ל׳',
              status: 'בפריסה',
            },
            {
              name: 'תאג״ד 71 קדמי',
              type: 'רפואת שדה נמ״ר',
              sector: 'צפון',
              cmd: 'סרן ד״ר רועי ק.',
              qty: 45,
              readiness: 100,
              fuel: '12,000 ל׳',
              status: 'צמוד לכוח',
            },
            {
              name: 'תאג״ד 74 קדמי',
              type: 'רפואת שדה נמ״ר',
              sector: 'מרכז',
              cmd: 'סרן ד״ר נועה פ.',
              qty: 45,
              readiness: 100,
              fuel: '12,000 ל׳',
              status: 'צמוד לכוח',
            },
            {
              name: 'יחידת חילוץ 669',
              type: 'חילוץ קרבי מוטס',
              sector: 'כוננות 7 דקות',
              cmd: 'סא״ל דני ק.',
              qty: 120,
              readiness: 100,
              fuel: '35,000 ל׳',
              status: 'בכוננות זינוק',
            },
            {
              name: 'יחידת עוקץ כלבנים',
              type: 'איתור מטענים',
              sector: 'מחסומים וצירים',
              cmd: 'סרן יובל ל.',
              qty: 80,
              readiness: 100,
              fuel: '10,000 ל׳',
              status: 'בסריקה',
            },
            {
              name: 'יחידת מודיעין שדה 595',
              type: 'תצפיות ורחפנים',
              sector: 'מוצבי גבול',
              cmd: 'סא״ל אביב מ.',
              qty: 240,
              readiness: 97,
              fuel: '22,000 ל׳',
              status: 'איסוף רציף',
            },
            {
              name: 'צוות הגנת סייבר א׳',
              type: 'הגנת רשתות ושו״ב',
              sector: 'בונקר פיקודי',
              cmd: 'רס״ן הראל ג.',
              qty: 40,
              readiness: 100,
              fuel: 'רשת חשמל',
              status: 'ניטור מתמיד',
            },
            {
              name: 'יחידת ל״א 555',
              type: 'לוחמה אלקטרונית',
              sector: 'חזית וגבול',
              cmd: 'סא״ל דב ש.',
              qty: 110,
              readiness: 95,
              fuel: '28,000 ל׳',
              status: 'בשיבוש יזום',
            },
          ]
            .map(
              (u, i) => `
            <tr>
              <td style="text-align: center;" class="jt-num">${i + 1}</td>
              <td><strong>${u.name}</strong></td>
              <td>${u.type}</td>
              <td>${u.sector}</td>
              <td>${u.cmd}</td>
              <td style="text-align: center;" class="jt-num">${u.qty.toLocaleString()}</td>
              <td style="text-align: center; color: ${u.readiness >= 95 ? '#16a34a' : '#ca8a04'}; font-weight: 600;">${u.readiness}%</td>
              <td style="text-align: right;" class="jt-num">${u.fuel}</td>
              <td style="text-align: center; color: #16a34a; font-weight: 600;">${u.status}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f8fafc; font-weight: bold;">
            <td colspan="5" style="text-align: left;">סה״כ סד״כ פעיל מרוכז:</td>
            <td style="text-align: center;" class="jt-num">18,520 לוחמים</td>
            <td style="text-align: center; color: #16a34a;">97.4% ממוצע</td>
            <td style="text-align: right;" class="jt-num">2,450,000 ליטר</td>
            <td style="text-align: center; color: #16a34a;">כשירות מלאה</td>
          </tr>
        </tfoot>
      </table>
    `,
  },
  {
    id: 'demo-section-4',
    title: 'סעיף 4: נספח טכנולוגי והוראות קשר (Long Procedural Content)',
    defaultContent: `
      <p>הנחיות הפעלה מפורטות לכלל רשתות הקשר והשו״ב המבצעיות (25 סעיפי חובה):</p>
      <ol style="padding-right: 20px; line-height: 1.8;">
        <li><strong>מעבר תדרים מתוזמן:</strong> כל יחידה תעבור לתדר חירום בכל 6 שעות בדיוק על פי לוח הזמנים המוצפן.</li>
        <li><strong>הגנת סייבר:</strong> אין לחבר התקנים ניידים או מדיה חיצונית לעמדות השליטה ללא אישור קצין אבטחת מידע.</li>
        <li><strong>גיבוי נתונים רציף:</strong> כל שינוי ביומן המבצעים מסונכרן אוטומטית למסד הנתונים של הפיקוד.</li>
        <li><strong>שקט אלחוטי:</strong> מעבר להאזנה בלבד בעת תנועה בצירים רגישים למניעת איכון אותות על ידי האויב.</li>
        <li><strong>הצפנת נתונים טקטית:</strong> שימוש במפתחות AES-256 והחלפת מפתח יומי בחצות בדיוק.</li>
        <li><strong>רשת קשר עליונה "יהלום":</strong> מיועדת לקשר ישיר בין מפקד הפיקוד למפקדי החטיבות בלבד.</li>
        <li><strong>רשת סיוע אש:</strong> כל דרישת אש ארטילרית או מוסקת תחייב ציון נ.צ מדויק ב-8 ספרות ואישור קש״א.</li>
        <li><strong>רשת פינוי רפואי:</strong> ערוץ פתוח 24/7 לדיווח נפגעים ותיאום מסוקי פינוי של יחידה 669.</li>
        <li><strong>הפעלת מערכות אנטי-שיבוש:</strong> בעת זיהוי שיבוש GPS יש לעבור לניווט אינרציאלי (INS) מקומי.</li>
        <li><strong>בדיקת קשר שעתית:</strong> כל מוצב וחפ״ק ישדר אות אימות קבוע בכל שעה עגולה.</li>
        <li><strong>תקשורת לוויינית חלופית:</strong> פריסת טרמינלים עצמאיים בכל מפקדת גדוד למקרה של נפילת תרנים.</li>
        <li><strong>בקרת מורשי גישה:</strong> כניסה לחדרי מבצעים תותר אך ורק לאחר זיהוי ביומטרי והצגת אישור בתוקף.</li>
        <li><strong>שילוב חוזי וידיאו:</strong> הזרמת 4 ערוצי וידיאו מוצפנים ממזל״טים ישירות למסך המרכזי.</li>
        <li><strong>ניהול נפילות והתרעות:</strong> קישוריות ישירה לצופרי פיקוד העורף ומערכות שידור סלולרי.</li>
        <li><strong>חלוקת סוללות ומצברים:</strong> כל מחלקת קשר תחזיק מלאי של 3 סטים מלאים של סוללות ליתיום טריות.</li>
        <li><strong>אישור הפעלת שיבוש יזום:</strong> הפעלת משבשי תדרים תאושר אך ורק לאחר וידוא שאין פגיעה בכוחותינו.</li>
        <li><strong>רשת כוחות מיוחדים:</strong> ערוץ ייעודי לצוותי קומנדו בעומק השטח בתדרי קשר מוצנחים.</li>
        <li><strong>הסוואת אנטנות ומשדרים:</strong> פריסת תרני שידור במרחק של לפחות 300 מטר ממבנה החפ״ק העיקרי.</li>
        <li><strong>תרגול נפילת רשת ראשית:</strong> ביצוע תרגול מעבר לערוצי גיבוי חוטים פעם במשמרת.</li>
        <li><strong>הגנת סיבים אופטיים:</strong> הטמנת כבלי תקשורת באדמה בעומק של לפחות 1 מטר למניעת פגיעות רסיסים.</li>
        <li><strong>בידוד רשתות מנהלתיות:</strong> איסור מוחלט על חיבור רשתות אינטרנט אזרחיות לרשת המבצעית.</li>
        <li><strong>תיעוד והקלטת קשר:</strong> כל שידור ברשתות המבצעיות מוקלט ומקוטלג אוטומטית לצורכי תחקור.</li>
        <li><strong>חתימת אישור פקודות דיגיטלי:</strong> פקודות מבצע יאושרו באמצעות חתימה דיגיטלית מאובטחת בלבד.</li>
        <li><strong>כיול תדרי חירום בין-זרועיים:</strong> תיאום תדרים משותפים עם ספינות חיל הים וכלי טיס של חיל האוויר.</li>
        <li><strong>סגירת מעגל והפקת לקחים:</strong> בסיום כל משמרת ייערך תחקיר קשר מלא לזיהוי כשלים טכניים.</li>
      </ol>
      <p><em>הערת בטיחות:</em> בעת זיהוי שיבוש אלקטרוני, יש להפעיל נוהל "ענן כהה" ולעבור לתקשורת חוטית מבודדת.</p>
    `,
  },
];

export const DEMO_USERS: Record<'alice' | 'bob', DemoUserDef> = {
  alice: {
    id: 'alice',
    name: 'אליס (משתמשת 1)',
    role: 'קמב״צית — עורכת ראשית',
    accentColor: '#2563eb',
  },
  bob: {
    id: 'bob',
    name: 'בוב (משתמש 2)',
    role: 'קצין אג״ם — עורך משני',
    accentColor: '#059669',
  },
};
