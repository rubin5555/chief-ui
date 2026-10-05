import type { DocumentDto, SectionStatus } from '@/pages/document/types';

const emptyPermissions = () => ({ approvers: [], editors: [] });

const makeStamp = (at: string, by: string) => ({ at, by });

const makeMeta = (status: SectionStatus, at = '05-10-2026 10:30', by = 'סגן אלון ר.') => ({
  status,
  hidden: false,
  classification: { level: null, viewerIds: [] },
  attachments: [],
  footnotes: [],
  lastModified: makeStamp(at, by),
});

// Helper to generate 230 units data
const generateUnits = () => {
  const units: Array<{
    name: string;
    type: string;
    sector: string;
    cmd: string;
    platform: string;
    qty: number;
    readiness: number;
    fuel: number;
    ammo: string;
    status: string;
  }> = [];

  // 1. Armored Corps (20 battalions)
  const armorData = [
    {
      num: 71,
      name: 'רשף',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'צפון-מזרח',
      cmd: 'סא״ל יונתן מ.',
    },
    { num: 74, name: 'סער', platform: 'מרכבה סימן 4 ברק', sector: 'צפון-מרכז', cmd: 'סא״ל גיא ב.' },
    {
      num: 77,
      name: 'עוז',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'צפון-מערב',
      cmd: 'סא״ל איתמר ג.',
    },
    {
      num: 82,
      name: 'געש',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'רמת הגולן חרמון',
      cmd: 'סא״ל יובל כ.',
    },
    {
      num: 52,
      name: 'הבוקעים',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'גזרת בקעה',
      cmd: 'סא״ל אסף ק.',
    },
    {
      num: 9,
      name: 'עשת',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'רזרבה חטיבתית',
      cmd: 'סא״ל דניאל ש.',
    },
    {
      num: 46,
      name: 'שלח',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'מרחב שומרון',
      cmd: 'סא״ל יאיר פ.',
    },
    {
      num: 195,
      name: 'אדם',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'גזרת שכם',
      cmd: 'סא״ל עמרי ל.',
    },
    {
      num: 196,
      name: 'שחק',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'גזרת רמאללה',
      cmd: 'סא״ל אורן ד.',
    },
    {
      num: 198,
      name: 'עזוז',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'גזרת עציון',
      cmd: 'סא״ל רמי צ.',
    },
    {
      num: 532,
      name: 'שלחון',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'מרחב חברון',
      cmd: 'סא״ל מתן א.',
    },
    {
      num: 53,
      name: 'סופה',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'עמק בית שאן',
      cmd: 'סא״ל נמרוד ז.',
    },
    {
      num: 75,
      name: 'רומח',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'עמק יזרעאל',
      cmd: 'סא״ל ברק ס.',
    },
    {
      num: 275,
      name: 'קרן',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'עתודת פיקוד',
      cmd: 'סא״ל זוהר ב.',
    },
    {
      num: 277,
      name: 'עופר',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'גזרת יהודה',
      cmd: 'סא״ל אלעד ו.',
    },
    {
      num: 288,
      name: 'צוק',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'גזרת שפלה',
      cmd: 'סא״ל תמיר מ.',
    },
    {
      num: 395,
      name: 'חנית',
      platform: 'מרכבה סימן 4 ממוגן',
      sector: 'ציר החוף',
      cmd: 'סא״ל נועם ש.',
    },
    {
      num: 396,
      name: 'מגן',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'מעבר גלבוע',
      cmd: 'סא״ל עידו ט.',
    },
    {
      num: 398,
      name: 'ברזל',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'מרחב מגידו',
      cmd: 'סא״ל רונן ר.',
    },
    {
      num: 401,
      name: 'חוד הברזל',
      platform: 'מרכבה סימן 4 ברק',
      sector: 'ציר חוד פיקודי',
      cmd: 'אל״ם דוד כ.',
    },
  ];
  armorData.forEach((a, i) => {
    units.push({
      name: `גדוד ${a.num} "${a.name}"`,
      type: 'שריון כבד',
      sector: a.sector,
      cmd: a.cmd,
      platform: a.platform,
      qty: 36,
      readiness: 92 + (i % 8),
      fuel: 75000 + i * 1200,
      ammo: i % 3 === 0 ? 'מלא' : '95%',
      status: 'כשיר מבצעית',
    });
  });

  // 2. Infantry & Airborne (25 units)
  const infData = [
    {
      num: 'צנחנים 890',
      name: 'אפעה',
      platform: 'זאב / האמר ממוגן',
      sector: 'מרחב מבוצר א׳',
      qty: 620,
    },
    {
      num: 'צנחנים 101',
      name: 'פתן',
      platform: 'זאב / האמר ממוגן',
      sector: 'מרחב מבוצר ב׳',
      qty: 610,
    },
    {
      num: 'צנחנים 202',
      name: 'צפע',
      platform: 'זאב / האמר ממוגן',
      sector: 'מרחב מבוצר ג׳',
      qty: 590,
    },
    {
      num: 'סיירת צנחנים',
      name: 'נחשון',
      platform: 'רכבי שטח קלים',
      sector: 'עומק השטח',
      qty: 150,
    },
    { num: 'גולני 12', name: 'ברק', platform: 'נמ״ר חי״ר כבד', sector: 'גזרת צפון א׳', qty: 640 },
    { num: 'גולני 13', name: 'גדעון', platform: 'נמ״ר חי״ר כבד', sector: 'גזרת צפון ב׳', qty: 630 },
    {
      num: 'גולני 51',
      name: 'הבוקעים הראשון',
      platform: 'נמ״ר חי״ר כבד',
      sector: 'גזרת גבול מזרח',
      qty: 620,
    },
    {
      num: 'סיירת גולני',
      name: 'הנמר המעופף',
      platform: 'רכבי זיבר מתקדמים',
      sector: 'חוד התקפי',
      qty: 160,
    },
    {
      num: 'גבעתי 424',
      name: 'שקד',
      platform: 'איתן 8x8 גלגלי',
      sector: 'ציר אורך מרכזי',
      qty: 600,
    },
    { num: 'גבעתי 432', name: 'צבר', platform: 'איתן 8x8 גלגלי', sector: 'ציר רוחב 4', qty: 590 },
    {
      num: 'גבעתי 435',
      name: 'רותם',
      platform: 'איתן 8x8 גלגלי',
      sector: 'מרחב ואדי מוסה',
      qty: 580,
    },
    {
      num: 'סיירת גבעתי',
      name: 'עורב החול',
      platform: 'רכבי פלסן שועל',
      sector: 'סריקות עומק',
      qty: 150,
    },
    { num: 'נח״ל 931', name: 'שחם', platform: 'נמ״ר ואיתן', sector: 'גזרת יהודה צפון', qty: 590 },
    { num: 'נח״ל 932', name: 'גרניט', platform: 'נמ״ר ואיתן', sector: 'גזרת יהודה מרכז', qty: 610 },
    { num: 'נח״ל 50', name: 'בזלת', platform: 'נמ״ר ואיתן', sector: 'גזרת עציון מורחב', qty: 600 },
    {
      num: 'סיירת נח״ל',
      name: 'בז הדרום',
      platform: 'רכבי קומנדו קלים',
      sector: 'איגוף מערבי',
      qty: 140,
    },
    { num: 'כפיר 90', name: 'נחשון', platform: 'פנתר ממוגן', sector: 'מרחב טולכרם', qty: 540 },
    { num: 'כפיר 92', name: 'שמשון', platform: 'פנתר ממוגן', sector: 'מרחב קלקיליה', qty: 550 },
    { num: 'כפיר 93', name: 'חרוב', platform: 'פנתר ממוגן', sector: 'מרחב ג׳נין דרום', qty: 530 },
    { num: 'כפיר 94', name: 'דוכיפת', platform: 'פנתר ממוגן', sector: 'מרחב בקעת הירדן', qty: 520 },
    { num: 'כפיר 97', name: 'נצח יהודה', platform: 'פנתר ממוגן', sector: 'מרחב בית אל', qty: 560 },
    {
      num: 'סיירת חרוב',
      name: 'העוקץ החודר',
      platform: 'רכבי דוד ופנתר',
      sector: 'פעולות כירורגיות',
      qty: 130,
    },
    {
      num: 'קומנדו מגלן 212',
      name: 'חרב פפיון',
      platform: 'רכבי שטח סודיים',
      sector: 'מטרות דיוק עמוק',
      qty: 180,
    },
    {
      num: 'קומנדו אגוז 621',
      name: 'אגוז קשה',
      platform: 'ציוד שטח מוסווה',
      sector: 'שטח הררי סבוך',
      qty: 180,
    },
    {
      num: 'קומנדו דובדבן 217',
      name: 'מסתערבים',
      platform: 'רכבים אזרחיים מוסווים',
      sector: 'ליבת אוכלוסייה',
      qty: 190,
    },
  ];
  infData.forEach((inf, i) => {
    units.push({
      name: `יחידת ${inf.num} "${inf.name}"`,
      type: 'חי״ר וקומנדו',
      sector: inf.sector,
      cmd: `סא״ל רונן ${String.fromCharCode(65 + (i % 20))}.`,
      platform: inf.platform,
      qty: inf.qty,
      readiness: 94 + (i % 7),
      fuel: 35000 + i * 800,
      ammo: 'מלא',
      status: 'כשיר מבצעית',
    });
  });

  // 3. Artillery & Rocket Artillery (20 units)
  for (let i = 1; i <= 20; i++) {
    const isRocket = i % 4 === 0;
    units.push({
      name: isRocket ? `גדוד משגרי רקטות ${300 + i} "סערת אש"` : `גדוד תותחנים ${400 + i} "רועם"`,
      type: isRocket ? 'משגרי MLRS ורומח' : 'ארטילריה כבדה M109/סיגמא',
      sector: `גזרת סיוע אש מרחב ${i}`,
      cmd: `סא״ל אבי ${String.fromCharCode(65 + (i % 22))}.`,
      platform: isRocket ? 'משגרי רקטות מונחות 300 מ״מ' : 'תותח מתנייע 155 מ״מ סיגמא',
      qty: isRocket ? 16 : 24,
      readiness: 93 + (i % 7),
      fuel: 48000 + i * 900,
      ammo: isRocket ? `${240 + i * 10} רקטות` : `${3000 + i * 150} פגזים`,
      status: 'מוכן לירי',
    });
  }

  // 4. Combat Engineering & Bridging (20 units)
  for (let i = 1; i <= 20; i++) {
    const isBridge = i % 5 === 0;
    const isYahalom = i === 1;
    units.push({
      name: isYahalom
        ? 'יחידת יהל״ם חבלה וקומנדו'
        : isBridge
          ? `פלוגת גישור והשקה ${10 + i}`
          : `פלוגת צמ״ה הנדסית ${i}`,
      type: isYahalom
        ? 'סילוק פצצות ומנהרות'
        : isBridge
          ? 'מעברי מים וחפירים'
          : 'פריצה כבדה וסלילת צירים',
      sector: `חוד הנדסי גזרה ${i}`,
      cmd: `רס״ן איתי ${String.fromCharCode(65 + (i % 24))}.`,
      platform: isYahalom
        ? 'רובוטי חבלה וערכות נפץ'
        : isBridge
          ? 'טנקי גישור צמד וגשר צף'
          : 'דחפורי D9R ממוגנים',
      qty: isYahalom ? 28 : isBridge ? 8 : 12,
      readiness: 90 + (i % 10),
      fuel: 32000 + i * 700,
      ammo: isYahalom ? 'מטעני חבלה מתקדמים' : isBridge ? 'ללא' : 'צפעי שריון ומטעני פריצה',
      status: 'בפעילות מבצעית',
    });
  }

  // 5. Combat Air Force, Helicopters & UAVs (25 units)
  const airSquadrons = [
    {
      num: 190,
      name: 'מגע הקסם',
      type: 'מסוקי קרב',
      platform: 'אפאצ׳י AH-64D',
      qty: 18,
      ammo: 'טילי הלפייר ותמוז',
    },
    {
      num: 113,
      name: 'הצרעה',
      type: 'מסוקי קרב',
      platform: 'אפאצ׳י AH-64E שרף',
      qty: 18,
      ammo: 'טילי הלפייר מונחים',
    },
    {
      num: 118,
      name: 'דורסי הלילה',
      type: 'הסקה כבדה',
      platform: 'יסעור CH-53',
      qty: 14,
      ammo: 'מקלעי מאג וציוד פינוי',
    },
    {
      num: 124,
      name: 'החרב המתהפכת',
      type: 'הסקה טקטית ופינוי',
      platform: 'בלק הוק UH-60 ינשוף',
      qty: 18,
      ammo: 'מקלעי מאג',
    },
    {
      num: 123,
      name: 'ציפורי המדבר',
      type: 'הסקה טקטית',
      platform: 'בלק הוק UH-60',
      qty: 16,
      ammo: 'מקלעי מאג',
    },
    {
      num: 193,
      name: 'מגיני המערב',
      type: 'סיור ימי וסיוע',
      platform: 'עטלף AS-565',
      qty: 10,
      ammo: 'חליפת מכ״ם ימי',
    },
    {
      num: 140,
      name: 'נשר הזהב',
      type: 'מטוסי חמקן',
      platform: 'F-35I אדיר',
      qty: 24,
      ammo: 'פצצות מונחות JDAM',
    },
    {
      num: 116,
      name: 'אריות הדרום',
      type: 'מטוסי חמקן',
      platform: 'F-35I אדיר',
      qty: 24,
      ammo: 'פצצות חודרות מונחות',
    },
    {
      num: 69,
      name: 'הפטישים',
      type: 'מטוסי תקיפה אסטרטגיים',
      platform: 'F-15I רעם',
      qty: 25,
      ammo: 'פצצות כבדות GBU-28',
    },
    {
      num: 253,
      name: 'הנגב',
      type: 'מטוסי קרב רב-משימתיים',
      platform: 'F-16I סופה',
      qty: 25,
      ammo: 'טילי אוויר-קרקע SPICE',
    },
    {
      num: 119,
      name: 'העטלף',
      type: 'מטוסי קרב רב-משימתיים',
      platform: 'F-16I סופה',
      qty: 25,
      ammo: 'חימוש מדויק',
    },
    {
      num: 107,
      name: 'אבירי הזנב הכתום',
      type: 'מטוסי קרב רב-משימתיים',
      platform: 'F-16I סופה',
      qty: 25,
      ammo: 'חימוש מדויק',
    },
    {
      num: 161,
      name: 'הנחש השחור',
      type: 'כטב״ם תקיפה ואיסוף',
      platform: 'הרמס 450 זיק',
      qty: 20,
      ammo: 'פצצות מיקרו מונחות',
    },
    {
      num: 200,
      name: 'המל״טים הראשון',
      type: 'כטב״ם איסוף אסטרטגי',
      platform: 'הרון 1 שובל',
      qty: 14,
      ammo: 'מטע״דים אופטיים',
    },
    {
      num: 210,
      name: 'הנשר הלבן',
      type: 'כטב״ם עומק כבד',
      platform: 'איתן הררון TP',
      qty: 12,
      ammo: 'מערכות מודיעין לווייני',
    },
    {
      num: 166,
      name: 'ציפורי האש',
      type: 'כטב״ם תקיפה טקטי',
      platform: 'הרמס 900 כוכב',
      qty: 16,
      ammo: 'חימושים אוטונומיים',
    },
    {
      num: 147,
      name: 'השחף המגביה',
      type: 'כטב״ם משימתי',
      platform: 'אורביטר 4',
      qty: 18,
      ammo: 'חיישנים תרמיים',
    },
    {
      num: 131,
      name: 'אבירי הציפור הצהובה',
      type: 'תובלה כבדה והצנחה',
      platform: 'קרנף C-130H',
      qty: 8,
      ammo: 'ערכות הצנחה',
    },
    {
      num: 103,
      name: 'הפילים',
      type: 'תובלה טקטית מתקדמת',
      platform: 'שמשון C-130J',
      qty: 8,
      ammo: 'מערכות תדלוק אווירי',
    },
    {
      num: 120,
      name: 'ענקי המדבר',
      type: 'תדלוק אווירי אסטרטגי',
      platform: 'בואינג 707 / KC-46',
      qty: 7,
      ammo: 'דלק סילוני מוטס',
    },
    {
      num: 122,
      name: 'הנחשון',
      type: 'בקרה אווירית ומודיעין',
      platform: 'גאלפסטרים G550 עיטם',
      qty: 6,
      ammo: 'מכ״מי שו״ב אווירי',
    },
    {
      num: 669,
      name: 'היחידה הטקטית לחילוץ',
      type: 'קומנדו רפואי מוטס',
      platform: 'מסוקי ינשוף וציוד חילוץ',
      qty: 60,
      ammo: 'נשק קל וערכות טראומה',
    },
    {
      num: 5101,
      name: 'יחידת שלדג',
      type: 'קומנדו אווירי לסימון מטרות',
      platform: 'רכבי שטח מוצנחים',
      qty: 120,
      ammo: 'צייני לייזר ומטענים',
    },
    {
      num: 5700,
      name: 'יחידת הנחתה קדמית',
      type: 'הכשרת מנחתים בשטח',
      platform: 'ציוד הנדסי מוטס',
      qty: 45,
      ammo: 'נשק אישי',
    },
    {
      num: 888,
      name: 'יחידת רפאים הרב-ממדית',
      type: 'תקיפה ולוחמה רב-זרועית',
      platform: 'רחפנים תוקפים ורובוטים',
      qty: 140,
      ammo: 'חימוש מבוזר',
    },
  ];
  airSquadrons.forEach((sq, i) => {
    units.push({
      name: `טייסת ${sq.num} "${sq.name}"`,
      type: sq.type,
      sector: 'מרחב אווירי עליון ורציף',
      cmd: `סא״ל תומר ${String.fromCharCode(65 + (i % 24))}.`,
      platform: sq.platform,
      qty: sq.qty,
      readiness: 95 + (i % 6),
      fuel: 65000 + i * 2500,
      ammo: sq.ammo,
      status: 'באוויר / כוננות זינוק מיידי',
    });
  });

  // 6. Air Defense & Missile Shield (25 units)
  for (let i = 1; i <= 25; i++) {
    const isIronDome = i <= 10;
    const isDavidSling = i > 10 && i <= 16;
    const isArrow = i > 16 && i <= 21;
    units.push({
      name: isIronDome
        ? `סוללת כיפת ברזל ${i}`
        : isDavidSling
          ? `סוללת קלע דוד ${i - 10}`
          : isArrow
            ? `סוללת חץ 3 סוללה ${i - 16}`
            : `סוללת מגן אור לייזר ${i - 21}`,
      type: isIronDome
        ? 'יירוט רקטות קצרות טווח וכטב״מים'
        : isDavidSling
          ? 'יירוט טילי שיוט ורקטות כבדות'
          : isArrow
            ? 'יירוט טילים בליסטיים מחוץ לאטמוספירה'
            : 'יירוט באנרגיה מרוכזת (קרן לייזר)',
      sector: `מרחב הגנה אווירית גזרה ${i}`,
      cmd: `רס״ן הראל ${String.fromCharCode(65 + (i % 22))}.`,
      platform: isIronDome
        ? 'משגרי טמי״ר ומכ״ם רב-משימתי MMR'
        : isDavidSling
          ? 'משגרי סטאנר ומכ״ם MMR מתקדם'
          : isArrow
            ? 'משגרי חץ ומכ״ם אורן ירוק/אדיר'
            : 'תותח לייזר 100 קילו-ואט ומעקב אופטי',
      qty: 4,
      readiness: 98 + (i % 3),
      fuel: 18000 + i * 400,
      ammo: isIronDome
        ? `${80 + i * 4} מיירטי טמי״ר`
        : isDavidSling
          ? `${36 + i * 2} מיירטים`
          : isArrow
            ? '24 מיירטי חץ'
            : 'אנרגיה רשתית בלתי מוגבלת',
      status: 'דריכות יירוט רציפה',
    });
  }

  // 7. Field Logistics, Fuel, Ammo & Maintenance (30 units)
  for (let i = 1; i <= 30; i++) {
    const isFuel = i % 3 === 0;
    const isAmmo = i % 3 === 1;
    units.push({
      name: isFuel
        ? `גדוד הספקת דלק ומים ${720 + i}`
        : isAmmo
          ? `גדוד תחמושת וחלוקה ${650 + i}`
          : `גדוד חימוש ואחזקת רק״ם ${850 + i}`,
      type: isFuel
        ? 'אספקת נוזלים קדמית'
        : isAmmo
          ? 'שינוע תחמושת כבדה'
          : 'חילוץ ותיקון טנקים בשדה',
      sector: `ציר אספקה מרחבי ${i}`,
      cmd: `סא״ל שמעון ${String.fromCharCode(65 + (i % 25))}.`,
      platform: isFuel
        ? 'מיכליות ממוגנות אושקוש 20,000 ליטר'
        : isAmmo
          ? 'מובילי טנקים וולוו ומשאיות כבדות'
          : 'טנקי חילוץ כבדים M88A2 הרקולס',
      qty: isFuel ? 40 : isAmmo ? 60 : 32,
      readiness: 91 + (i % 8),
      fuel: 380000 + i * 15000,
      ammo: isAmmo ? '500 טון תחמושת במעבר' : 'ערכות נשק אישי',
      status: 'פעיל בצירים',
    });
  }

  // 8. Field Medical, Hospitals & Triage (25 units)
  for (let i = 1; i <= 25; i++) {
    const isHospital = i <= 4;
    const isSurgical = i > 4 && i <= 10;
    units.push({
      name: isHospital
        ? `בית חולים שדה פיקודי ${i}`
        : isSurgical
          ? `פלוגת החייאה וכירורגיה ${35 + i}`
          : `תאג״ד גדודי קדמי ${i - 10}`,
      type: isHospital
        ? 'רפואה מתקדמת וחדרי ניתוח'
        : isSurgical
          ? 'כירורגיה קדמית לייצוב פצועים'
          : 'פינוי וטראומה קדמית תחת אש',
      sector: `מתחם רפואה שדה ${i}`,
      cmd: `סרן ד״ר ליאור ${String.fromCharCode(65 + (i % 24))}.`,
      platform: isHospital
        ? 'משאיות בית חולים מודולריות'
        : isSurgical
          ? 'נגמ״שי כירורגיה ממוגנים'
          : 'אמבולנסים משוריינים נמ״ר',
      qty: isHospital ? 120 : isSurgical ? 24 : 10,
      readiness: 100,
      fuel: 14000 + i * 600,
      ammo: 'ערכות עירוי, מנות דם O וציוד הנשמה',
      status: 'מוכן לקליטת נפגעים',
    });
  }

  // 9. C4I, Cyber, Sigint & Electronic Warfare (25 units)
  for (let i = 1; i <= 25; i++) {
    const isCyber = i <= 8;
    const isEW = i > 8 && i <= 16;
    units.push({
      name: isCyber
        ? `צוות הגנת סייבר רשתי ${i}`
        : isEW
          ? `יחידת לוחמה אלקטרונית ושיבוש ${550 + i}`
          : `גדוד קשר ותקשוב לווייני ${370 + i}`,
      type: isCyber
        ? 'ניטור איומי סייבר והגנת שרתים'
        : isEW
          ? 'שיבוש תדרי אויב ונטרול רחפנים'
          : 'תקשורת שו״ב ורשתות פס-רחב',
      sector: `מתחם שליטה ובקרה פיקודי ${i}`,
      cmd: `רס״ן הילה ${String.fromCharCode(65 + (i % 20))}.`,
      platform: isCyber
        ? 'שרתי אבטחה מבודדים ופיירוולים'
        : isEW
          ? 'משבשי תדרים מתקדמים ואנטנות כיווניות'
          : 'רכבי ממסר לווייני וסיבים אופטיים',
      qty: 24,
      readiness: 98 + (i % 3),
      fuel: isCyber ? 0 : 25000 + i * 700,
      ammo: 'כלי תוכנה ואמצעי שידור מוצפנים',
      status: 'פעיל 24/7',
    });
  }

  // 10. Intelligence, Target Acquisition & Special Recon (15 units)
  for (let i = 1; i <= 15; i++) {
    units.push({
      name: `יחידת איסוף ומטרות שדה ${590 + i}`,
      type: 'איתור מטרות והכוונת אש בלייזר',
      sector: `מוצבי תצפית חוד ${i}`,
      cmd: `סא״ל יואב ${String.fromCharCode(65 + (i % 15))}.`,
      platform: 'מגדלי תצפית רואה-יורה, מכ״מי קרקע וצייני לייזר',
      qty: 20,
      readiness: 97 + (i % 4),
      fuel: 12000 + i * 500,
      ammo: 'ציינים אופטיים ותחמושת צלפים',
      status: 'איסוף רציף',
    });
  }

  return units;
};

// Generates the munitions inventory table (35 rows)
const generateMunitionsInventoryTable = (): string => {
  const munitions = [
    {
      name: 'טילי תמוז Spike NLOS דור 6',
      caliber: 'אלקטרו-אופטי RF',
      stock: '1,450 יח׳',
      loc: 'בונקר תחמושת צפון',
      alloc: 'מפקדי חטיבות מתמרנות',
      stat: 'כשיר',
    },
    {
      name: 'טילי הלפייר AGM-114R רומיאו',
      caliber: 'הנחיית לייזר כפולה',
      stock: '2,800 יח׳',
      loc: 'בסיס רמת דוד ותל נוף',
      alloc: 'טייסות אפאצ׳י 190 ו-113',
      stat: 'כשיר',
    },
    {
      name: 'פצצות חודרות בונקר GBU-31 JDAM',
      caliber: '2,000 ליברות GPS',
      stock: '950 יח׳',
      loc: 'מחסני חירום מרכז',
      alloc: 'טייסות F-15I ו-F-35I',
      stat: 'כשיר',
    },
    {
      name: 'ערכות הנחיה מדויקות SPICE 1000',
      caliber: 'אלקטרו-אופטי מתקדם',
      stock: '1,200 יח׳',
      loc: 'בסיס חצור וחצרים',
      alloc: 'טייסות F-16I סופה',
      stat: 'כשיר',
    },
    {
      name: 'פגזי טנקים 120 מ״מ ח״ש-חודרן APFSDS',
      caliber: 'חודר שריון קינטי',
      stock: '24,000 פגז',
      loc: 'מחסנים גדודיים קדמיים',
      alloc: 'גדודי שריון 71, 74, 52, 9',
      stat: 'כשיר',
    },
    {
      name: 'פגזי טנקים 120 מ״מ "כלנית" רב-תכליתי',
      caliber: 'נגד חי״ר ומבנים',
      stock: '18,500 פגז',
      loc: 'מחסנים גדודיים קדמיים',
      alloc: 'כלל טנקי מרכבה 4',
      stat: 'כשיר',
    },
    {
      name: 'פגזי טנקים 120 מ״מ "חצב" חודר בטון',
      caliber: 'השהיה ורסס מבוקר',
      stock: '12,000 פגז',
      loc: 'מאגר פיקודי',
      alloc: 'צוותי קרב חטיבתיים',
      stat: 'כשיר',
    },
    {
      name: 'פגזי ארטילריה 155 מ״מ מתנפץ תקני M107',
      caliber: 'רסס שטח כבד',
      stock: '85,000 פגז',
      loc: 'מאגרי אגד ארטילרי 282',
      alloc: 'סוללות תומ״ת רועם',
      stat: 'כשיר',
    },
    {
      name: 'פגזי ארטילריה 155 מ״מ מונחי GPS "אקסקלביר"',
      caliber: 'דיוק פגיעה 2 מטר',
      stock: '3,200 פגז',
      loc: 'מחסן שמור אגד 215',
      alloc: 'ירי כירורגי בעומק',
      stat: 'כשיר',
    },
    {
      name: 'רקטות רומח מונחות GPS בקוטר 122 מ״מ',
      caliber: 'טווח 40 ק״מ',
      stock: '2,400 רקטות',
      loc: 'גדוד רקטות רעם',
      alloc: 'ריכוך מתחמים מבוצרים',
      stat: 'כשיר',
    },
    {
      name: 'טילי אקסטרא EXTRA בקוטר 306 מ״מ',
      caliber: 'טווח 150 ק״מ רש״ק 120 ק״ג',
      stock: '680 רקטות',
      loc: 'בסיס שיגור מרכזי',
      alloc: 'מפקדת פיקוד / מכלול אש',
      stat: 'כשיר',
    },
    {
      name: 'מיירטי טמי״ר עבור מערכת כיפת ברזל',
      caliber: 'ראש ביות אופטי-מכ״מי',
      stock: '4,500 מיירטים',
      loc: 'סוללות פרוסות ומאגר',
      alloc: 'כנף הגנה אווירית 168',
      stat: 'כשיר',
    },
    {
      name: 'מיירטי סטאנר (קלע דוד)',
      caliber: 'ראש ביות כפול Hit-to-Kill',
      stock: '850 מיירטים',
      loc: 'מתחמי שיגור מרכזיים',
      alloc: 'כנף הגנה אווירית 167',
      stat: 'כשיר',
    },
    {
      name: 'מיירטי חץ 3 אקסו-אטמוספריים',
      caliber: 'יירוט שגיא בחלל',
      stock: '320 מיירטים',
      loc: 'אתרי חץ סודיים',
      alloc: 'מפקדת חיל האוויר',
      stat: 'כשיר',
    },
    {
      name: 'טילי כתף נגד טנקים Spike-SR',
      caliber: 'שגר ושכח קל משקל',
      stock: '2,100 יח׳',
      loc: 'פלוגות נשק מסייע חי״ר',
      alloc: 'לוחמי חוד צנחנים וגולני',
      stat: 'כשיר',
    },
    {
      name: 'טילי לאו משופרים M72A7',
      caliber: 'קוטר 66 מ״מ פריצה',
      stock: '6,400 יח׳',
      loc: 'נגמ״שי חי״ר קדמיים',
      alloc: 'כיתות לוחמי חי״ר',
      stat: 'כשיר',
    },
    {
      name: 'טילי מטאדור (RGW90) מפצח בונקרים',
      caliber: 'רש״ק כפול חודר קיר',
      stock: '3,800 יח׳',
      loc: 'מחסנים גזרתיים',
      alloc: 'יחידות חוד הנדסה וחי״ר',
      stat: 'כשיר',
    },
    {
      name: 'מערכות פריצה הנדסיות "צפע שריון" (צפ״ש)',
      caliber: 'מטען שרשרת 1,000 ק״ג',
      stock: '180 מערכות',
      loc: 'פלוגות צמ״ה ויהל״ם',
      alloc: 'פריצת שדות מוקשים',
      stat: 'כשיר',
    },
    {
      name: 'מטעני חבלה כירורגיים "שפרוני"',
      caliber: 'חיתוך מבוקר ופריצת דלת',
      stock: '4,200 יח׳',
      loc: 'יהל״ם ומגלן',
      alloc: 'צוותי לוחמה במנהרות',
      stat: 'כשיר',
    },
    {
      name: 'רימוני רסס והלם תקניים',
      caliber: 'השלכה ידנית',
      stock: '95,000 יח׳',
      loc: 'כלל האגדים והחטיבות',
      alloc: 'נשק אישי לוחם',
      stat: 'כשיר',
    },
    {
      name: 'תחמושת קלה 5.56 מ״מ מנותבת וירוקה',
      caliber: 'מחסניות M4 ותבור',
      stock: '8,500,000 כדור',
      loc: 'מחסני תחמושת חטיבתיים',
      alloc: 'כלל הכוחות',
      stat: 'כשיר',
    },
    {
      name: 'תחמושת מקלעים 7.62 מ״מ למאג ונגב',
      caliber: 'שרשראות ירי',
      stock: '4,200,000 כדור',
      loc: 'רק״ם וטנקים',
      alloc: 'כוחות מתמרנים',
      stat: 'כשיר',
    },
    {
      name: 'תחמושת כבדה 0.5 אינץ׳ (12.7 מ״מ)',
      caliber: 'חודר שריון נותב',
      stock: '1,800,000 כדור',
      loc: 'עמדות קטלנית ונמ״ר',
      alloc: 'רק״ם חי״ר ושריון',
      stat: 'כשיר',
    },
    {
      name: 'רימוני עשן מיסוך תרמי לרק״ם',
      caliber: 'חסימת ראיית אינפרא-אדום',
      stock: '14,000 יח׳',
      loc: 'מדוכות עשן בטנקים',
      alloc: 'מרכבה 4 ונמ״ר',
      stat: 'כשיר',
    },
    {
      name: 'רחפני תקיפה מתאבדים אוטונומיים',
      caliber: 'מטען 3 ק״ג GPS/אופטי',
      stock: '1,600 יח׳',
      loc: 'צוותי מטרות מיוחדים',
      alloc: 'יחידת רפאים וקומנדו',
      stat: 'כשיר',
    },
    {
      name: 'מערכות שיבוש נגד רחפנים "כיפת רחפן"',
      caliber: 'שיבוש רדיו ולייזר',
      stock: '320 ערכות',
      loc: 'חפ״קים ומוצבי גבול',
      alloc: 'אבטחת שיירות ומפקדות',
      stat: 'כשיר',
    },
    {
      name: 'מוקשי תאורה וגילוי גבול',
      caliber: 'תאורת שטח 400 מטר',
      stock: '8,000 יח׳',
      loc: 'מוצבי ביטחון שוטף',
      alloc: 'גדודים מרחביים',
      stat: 'כשיר',
    },
    {
      name: 'טילי אוויר-אוויר פיתון 5',
      caliber: 'ביות תת-אדום מלא 360',
      stock: '750 טילים',
      loc: 'דת״קים בסיסי חיל האוויר',
      alloc: 'טייסות קרב F-16 ו-F-15',
      stat: 'כשיר',
    },
    {
      name: 'טילי אוויר-אוויר דרור (AMRAAM AIM-120D)',
      caliber: 'מכ״ם אקטיבי מעבר לאופק',
      stock: '620 טילים',
      loc: 'דת״קים F-35I',
      alloc: 'טייסות עליונות אווירית',
      stat: 'כשיר',
    },
    {
      name: 'פצצות מונחות לייזר GBU-12 פייבווי',
      caliber: '500 ליברות דיוק',
      stock: '2,900 פצצות',
      loc: 'בסיסי כנף חיל האוויר',
      alloc: 'סיוע אוויר קרוב CAS',
      stat: 'כשיר',
    },
  ];

  const rows = munitions
    .map(
      (m, i) => `
    <tr>
      <td style="text-align: center;" class="jt-num">${i + 1}</td>
      <td><strong>${m.name}</strong></td>
      <td>${m.caliber}</td>
      <td style="text-align: center; font-weight: 600;" class="jt-num">${m.stock}</td>
      <td>${m.loc}</td>
      <td>${m.alloc}</td>
      <td style="text-align: center; color: #16a34a; font-weight: bold;">${m.stat}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <div style="margin-top: 32px;">
      <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 8px;">טבלה 2.2: מאזן חימושים מדויקים, פגזים ומיירטים במאגרים הפיקודיים</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
        <caption class="jt-caption">טבלה 2.2: מלאי אמל״ח מדויק, פגזים וטילים (30 סוגי תחמושת אסטרטגית)</caption>
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="width: 35px; text-align: center;">מס״ד</th>
            <th style="text-align: right;">שם החימוש והדגם</th>
            <th style="text-align: right;">מאפיין טכנולוגי והנחיה</th>
            <th style="text-align: center; width: 110px;">מלאי זמין במאגר</th>
            <th style="text-align: right;">מיקום אחסון עיקרי</th>
            <th style="text-align: right;">הקצאה משימתית</th>
            <th style="text-align: center; width: 80px;">סטטוס כשירות</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

// Generates the fleet master table + sub-tables and directives
const generateFleetTableContent = (): string => {
  const units = generateUnits();

  const unitRows = units
    .map(
      (u, i) => `
    <tr>
      <td style="text-align: center;" class="jt-num">${i + 1}</td>
      <td><strong>${u.name}</strong></td>
      <td>${u.type}</td>
      <td>${u.sector}</td>
      <td>${u.cmd}</td>
      <td>${u.platform}</td>
      <td style="text-align: center;" class="jt-num">${u.qty.toLocaleString()}</td>
      <td style="text-align: center; color: ${u.readiness >= 95 ? '#16a34a' : '#ca8a04'}; font-weight: 600;">${u.readiness}%</td>
      <td style="text-align: right;" class="jt-num">${u.fuel ? `${u.fuel.toLocaleString()} ליטר` : 'רשת חשמל'}</td>
      <td>${u.ammo}</td>
      <td style="text-align: center; color: #16a34a; font-weight: 600;">${u.status}</td>
    </tr>
  `,
    )
    .join('');

  const munitionsTable = generateMunitionsInventoryTable();

  return `
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <h3 style="margin-top: 0; color: #1e293b; font-size: 17px;">לוח מחוונים מרכזי: סיכום סד״כ וכשירות מבצעית כוללת</h3>
      <p style="margin: 4px 0 16px 0; color: #475569; font-size: 13px;">נתונים מסונכרנים בזמן אמת ממערכות השו״ב המטכ״ליות. להלן מדדי המפתח לכלל הכוחות המשתתפים במבצע:</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">יחידות משימתיות</div>
          <div style="font-size: 22px; font-weight: bold; color: #0f172a; margin-top: 4px;">${units.length}</div>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">סה״כ סד״כ לוחם</div>
          <div style="font-size: 22px; font-weight: bold; color: #2563eb; margin-top: 4px;">54,120</div>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">כשירות ממוצעת</div>
          <div style="font-size: 22px; font-weight: bold; color: #16a34a; margin-top: 4px;">96.4%</div>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">מלאי דלק מנופק</div>
          <div style="font-size: 22px; font-weight: bold; color: #ea580c; margin-top: 4px;">5,840,000 ל׳</div>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center;">
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">כיסוי הגנה אווירית</div>
          <div style="font-size: 22px; font-weight: bold; color: #16a34a; margin-top: 4px;">100% רציף</div>
        </div>
      </div>
    </div>

    <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
      <caption class="jt-caption">טבלה 2.1: מצבת כוחות מלאה, פריסה גזרתית, כשירות ומשאבים (${units.length} יחידות וגדודים משימתיים)</caption>
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="text-align: center; width: 35px;">מס״ד</th>
          <th style="text-align: right;">שם הכוח / יחידה</th>
          <th style="text-align: right;">ייעוד טקטי</th>
          <th style="text-align: right;">גזרת אחריות</th>
          <th style="text-align: right;">מפקד הכוח</th>
          <th style="text-align: right;">פלטפורמה עיקרית</th>
          <th style="text-align: center;">סד״כ</th>
          <th style="text-align: center;">כשירות</th>
          <th style="text-align: right;">מלאי דלק</th>
          <th style="text-align: right;">חימוש זמין</th>
          <th style="text-align: center;">סטטוס מבצעי</th>
        </tr>
      </thead>
      <tbody>
        ${unitRows}
      </tbody>
      <tfoot>
        <tr style="background-color: #f8fafc; font-weight: bold;">
          <td colspan="6" style="text-align: left;">סה״כ סד״כ פעיל ומלאי דלק פיקודי מרוכז לכלל ${units.length} היחידות:</td>
          <td style="text-align: center;" class="jt-num">54,120 לוחמים</td>
          <td style="text-align: center; color: #16a34a;">96.4% ממוצע ארצי</td>
          <td style="text-align: right;" class="jt-num">5,840,000 ליטר</td>
          <td colspan="2" style="text-align: center; color: #16a34a;">אספקה מלאה ל-14 ימי לחימה עצימה</td>
        </tr>
      </tfoot>
    </table>

    ${munitionsTable}

    <div style="margin-top: 32px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 16px;">
      <h3 style="color: #92400e; margin-top: 0; font-size: 15px;">הנחיות הפעלה מיוחדות והוראות בטיחות לכוחות היבשה והאוויר:</h3>
      <ol style="margin-bottom: 0; padding-right: 20px; line-height: 1.7; color: #78350f; font-size: 13px;">
        <li>חל איסור מוחלט על תנועת רק״ם יחיד ללא חיפוי הדדי של כוח תואם ומעטפת אבטחה של כטב״ם או מסק״ר.</li>
        <li>כל ירי ארטילרי או הפעלת רקטות רומח מעבר לקו התיאום CFL תחייב אישור מפורש של קצין שיתוף האש (קש״א) בחפ״ק האוגדתי.</li>
        <li>סוללות כיפת ברזל וקלע דוד יקבלו עדיפות עליונה בהקצאת קווי חשמל ודלק לגנרטורים להבטחת רציפות יירוט 24/7.</li>
        <li>כוחות שריון וחי״ר לא יתקדמו בשטחים בנויים ללא סריקה מקדימה של רחפנים ודחפורי D9 מובילים לפתיחת צירים.</li>
        <li>חובת דיווח מיידי על כל פגיעה במערכות מיגון אקטיבי ("מעיל רוח") או ירידה בכשירות אופטרונית של כלי הרק״ם.</li>
        <li>כל שינוי במיקומי גדודי האספקה והתחמושת ידווח מיידית למכלול הלוגיסטיקה הפיקודי לצורך עדכון נתיבי שיירות.</li>
      </ol>
    </div>
  `;
};

// Generates a massive operational log (100+ events)
const generateOperationalLogTable = (): string => {
  const events: Array<{
    time: string;
    loc: string;
    unit: string;
    desc: string;
    sev: string;
    act: string;
  }> = [];

  const rawEvents = [
    {
      time: '00:01',
      loc: 'צומת גולני',
      unit: 'גדס״ר 401',
      desc: 'פתיחת ציר שלהבת, נטרול שני מטעני צד ללא נפגעים.',
      sev: 'גבוה',
      act: 'הושלם בהצלחה',
    },
    {
      time: '00:15',
      loc: 'נ.ג. 320',
      unit: 'תצפית 595',
      desc: 'זיהוי רחפן עוין מנמיך טוס מכיוון צפון-מזרח.',
      sev: 'בינוני',
      act: 'הופל בלוחמה אלקטרונית',
    },
    {
      time: '00:28',
      loc: 'בסיס אלון',
      unit: 'אגד 650',
      desc: 'השלמת העמסה של 40 משאיות תחמושת ודלק.',
      sev: 'שגרה',
      act: 'שיירה יצאה בליווי',
    },
    {
      time: '00:42',
      loc: 'מוצב חרמון קדמי',
      unit: 'גדוד 71',
      desc: 'ירי נ״ט מרוחק לעבר מוצב שמירה. אין נפגעים, נזק קל לבטונדה.',
      sev: 'גבוה',
      act: 'אש תגובה פגעה במשגר',
    },
    {
      time: '00:55',
      loc: 'חוות יזרעאל',
      unit: 'תאג״ד 71',
      desc: 'קליטת פצוע קל מאירוע פריצת ציר, טופל במקום וחזר לפעילות.',
      sev: 'נמוך',
      act: 'טופל בהצלחה',
    },
    {
      time: '01:10',
      loc: 'מרחב גדעון',
      unit: 'צמ״ה א׳',
      desc: 'דחפור D9 סלל דרך עוקפת באורך 2.4 ק״מ למעקף גשר שנפגע.',
      sev: 'בינוני',
      act: 'הציר פתוח לתנועה',
    },
    {
      time: '01:25',
      loc: 'ערוץ ואדי קלט',
      unit: 'סיירת צנחנים',
      desc: 'היתקלות בחוליית חמושים ממרחק 80 מטר. 3 חמושים נוטרלו.',
      sev: 'קריטי',
      act: 'סריקות במרחב הושלמו',
    },
    {
      time: '01:40',
      loc: 'כלל הגזרה',
      unit: 'מפקדת פיקוד',
      desc: 'מעבר תדרים מתוזמן של שעה 01:40 בכלל רשתות הקשר הפיקודיות.',
      sev: 'שגרה',
      act: 'אימות 100% קשר',
    },
    {
      time: '01:55',
      loc: 'מרחב אווירי צפון',
      unit: 'טייסת 161',
      desc: 'כטב״ם זיק סיכל רכב תופת שנע לכיוון עמדת כוחותינו בציר 8.',
      sev: 'קריטי',
      act: 'השמדה מלאה מהאוויר',
    },
    {
      time: '02:10',
      loc: 'צומת נמר',
      unit: 'גדוד 74',
      desc: 'טנקי מרכבה תפסו עמדות שולטות על צומת נמר ומבצעים ירי מדויק.',
      sev: 'גבוה',
      act: 'שליטה מבצעית מלאה',
    },
    {
      time: '02:25',
      loc: 'בונקר שו״ב',
      unit: 'סייבר א׳',
      desc: 'זיהוי מתקפת מניעת שירות (DDoS) נגד שרתי הדיווח הפיקודיים.',
      sev: 'גבוה',
      act: 'חסימת כתובות ובידוד',
    },
    {
      time: '02:38',
      loc: 'אתר שידור רמות',
      unit: 'גדוד 371',
      desc: 'פגיעת רסיס במשדר ממסר לווייני. מעבר מיידי למשדר גיבוי.',
      sev: 'בינוני',
      act: 'משדר חלופי פעיל',
    },
    {
      time: '02:50',
      loc: 'מרחב שושן',
      unit: 'צנחנים 890',
      desc: 'הנחתת כוח מוסק באמצעות מסוקי יסעור הושלמה בהצלחה.',
      sev: 'גבוה',
      act: 'כוחות פרוסים בעמדות',
    },
    {
      time: '03:05',
      loc: 'מעבר נחל יבוק',
      unit: 'פלוגת גישורים',
      desc: 'השקת גשר צמד מעל ואדי מים זורמים. נבדק לנשיאת 70 טון.',
      sev: 'בינוני',
      act: 'מעבר רק״ם מאושר',
    },
    {
      time: '03:20',
      loc: 'סוללת כיפת ברזל 1',
      unit: 'נ״מ',
      desc: 'יירוט מוצלח של מטח 4 רקטות ששוגר לעבר ריכוז כוחות.',
      sev: 'קריטי',
      act: 'יירוט 4 מתוך 4',
    },
    {
      time: '03:35',
      loc: 'מתחם נ.ג. 412',
      unit: 'גדס״ר צנחנים',
      desc: 'כיבוש הגבעה השלטת והצבת מכ״ם טקטי מתקדם.',
      sev: 'גבוה',
      act: 'היעד בידינו',
    },
    {
      time: '03:50',
      loc: 'עורף לוגיסטי',
      unit: 'גדוד 721',
      desc: 'תדלוק מלא של 120 כלי רכב כבדים וטנקים בנקודת אספקה 4.',
      sev: 'שגרה',
      act: 'הושלם',
    },
    {
      time: '04:05',
      loc: 'חפ״ק קדמי',
      unit: 'קצין אג״ם',
      desc: 'הערכת מצב בוקר בראשות אלוף הפיקוד. אישור תוכנית שלב ב׳.',
      sev: 'גבוה',
      act: 'פקודות הופצו',
    },
    {
      time: '04:20',
      loc: 'גזרה מערבית',
      unit: 'טייסת 190',
      desc: 'מסוקי קרב השמידו עמדת נ״ט עוינת שהוסוותה במטע זיתים.',
      sev: 'גבוה',
      act: 'מטרה הושמדה',
    },
    {
      time: '04:35',
      loc: 'צומת גדעון',
      unit: 'משטרה צבאית',
      desc: 'הסדרת שיירת אספקה באורך 3 ק״מ. הציר מאובטח ופנוי.',
      sev: 'שגרה',
      act: 'השיירה עברה',
    },
    {
      time: '04:50',
      loc: 'בסיס כנף קדמי',
      unit: 'יחידת 669',
      desc: 'כוננות זינוק ברמת 5 דקות לחילוץ צוות טייס שפעל בעומק.',
      sev: 'קריטי',
      act: 'הצוות שב בשלום',
    },
    {
      time: '05:05',
      loc: 'כלל הפיקוד',
      unit: 'מפקדת פיקוד',
      desc: 'עדכון יומי של תמונת המצב המודיעינית והפצת יעדי יום לחימה.',
      sev: 'שגרה',
      act: 'מפות סונכרנו',
    },
    {
      time: '05:20',
      loc: 'ציר שלהבת דרום',
      unit: 'עוקץ',
      desc: 'כלב גישוש איתר מטען חבלה מוסווה בחבית בצד הדרך.',
      sev: 'גבוה',
      act: 'חבלני יהל״ם פוצצו',
    },
    {
      time: '05:35',
      loc: 'גזרה צפונית',
      unit: 'גדוד 52',
      desc: 'זיהוי תנועת 3 נגמ״שי אויב. פתיחה באש מדויקת ופגיעה ישירה.',
      sev: 'קריטי',
      act: 'כלי רכב נוטרלו',
    },
    {
      time: '05:50',
      loc: 'מוצב תצפית 12',
      unit: 'מודיעין שדה',
      desc: 'זיהוי עמדת מרגמה עוינת. העברת נ.צ מדויק לארטילריה.',
      sev: 'גבוה',
      act: 'תותחנים השמידו',
    },
    {
      time: '06:05',
      loc: 'תאג״ד 74',
      unit: 'רפואה',
      desc: 'פינוי מוסק של לוחם שנפגע מרסיס, פונה במסוק לבי״ח רמב״ם.',
      sev: 'בינוני',
      act: 'פונה במצב יציב',
    },
    {
      time: '06:20',
      loc: 'רשת שוהם',
      unit: 'סייבר ב׳',
      desc: 'בדיקת תקינות מלאה של הצפנת ערוצי החוזי והווידאו המבצעיים.',
      sev: 'שגרה',
      act: 'תקין 100%',
    },
    {
      time: '06:35',
      loc: 'קו הגבול המרכזי',
      unit: 'צנחנים 101',
      desc: 'הקמת עמדות ירי מבוצרות לאורך 4 ק״מ של קו המגע.',
      sev: 'בינוני',
      act: 'הושלם',
    },
    {
      time: '06:50',
      loc: 'מרחב מגידו',
      unit: 'פלח״ק 36',
      desc: 'תרגול קליטת אר״ן (אירוע רב-נפגעים) בתיאום מד״א ומשטרה.',
      sev: 'שגרה',
      act: 'תרגיל מוצלח',
    },
    {
      time: '07:05',
      loc: 'גזרת חוד מזרחי',
      unit: 'יהל״ם',
      desc: 'איתור פיר מנהרה התקפית. החדרת רובוט ופיצוץ יזום ב-800 ק״ג חבלה.',
      sev: 'קריטי',
      act: 'המנהרה הושמדה',
    },
    {
      time: '07:20',
      loc: 'מפקדת חטיבה 401',
      unit: 'קשר״פ',
      desc: 'החלפת סוללות ומצברים לכלל מכשירי הקשר והניווט הגדודיים.',
      sev: 'שגרה',
      act: 'הושלם',
    },
    {
      time: '07:35',
      loc: 'מרחב אווירי עליון',
      unit: 'טייסת 200',
      desc: 'זיהוי שיגור טיל קרקע-אוויר לעבר כלי טיס. הטיל החטיא.',
      sev: 'קריטי',
      act: 'משגר הטיל הושמד',
    },
    {
      time: '07:50',
      loc: 'עיריית עפולה',
      unit: 'יקל״ר',
      desc: 'תיאום פתיחת מקלטים נוספים וחלוקת מזון לאזרחים ותיקים.',
      sev: 'שגרה',
      act: 'בוצע',
    },
    {
      time: '08:05',
      loc: 'ציר ברק מרכז',
      unit: 'צמ״ה ב׳',
      desc: 'סילוק גלי אבנים וסלעים שחסמו את המעבר לכלי רכב כבדים.',
      sev: 'בינוני',
      act: 'ציר נפתח',
    },
    {
      time: '08:20',
      loc: 'בונקר פיקודי',
      unit: 'מפקדת פיקוד',
      desc: 'אישור פקודת מבצע "חומת מגן" גרסה 4 והפצתה ברשתות.',
      sev: 'שגרה',
      act: 'פקודה עודכנה',
    },
    {
      time: '08:35',
      loc: 'מתחם תעשייתי צפוני',
      unit: 'גדוד 71',
      desc: 'השתלטות על מאגר דלק אזרחי ואבטחתו מפני ניסיונות הצתה.',
      sev: 'גבוה',
      act: 'המתחם מאובטח',
    },
    {
      time: '08:50',
      loc: 'גזרת בקעה',
      unit: 'גדוד 52',
      desc: 'סיכול הברחת אמל״ח כבד. נתפסו 40 טילי כתף ו-200 מטענים.',
      sev: 'קריטי',
      act: 'אמל״ח הוחרם',
    },
    {
      time: '09:05',
      loc: 'מכלול אוויר',
      unit: 'קש״א פיקודי',
      desc: 'תיאום "בועת אש" למבצע חילוץ מוסק של צוות סיור מנותק.',
      sev: 'קריטי',
      act: 'החילוץ הושלם',
    },
    {
      time: '09:20',
      loc: 'רשת יהלום',
      unit: 'קצין אג״ם',
      desc: 'בדיקת קשר קולית עם כלל מפקדי האוגדות והחטיבות.',
      sev: 'שגרה',
      act: 'כולם שומעים 5',
    },
    {
      time: '09:35',
      loc: 'סוללת קלע דוד',
      unit: 'נ״מ',
      desc: 'העלאת כוננות בעקבות התרעה על ירי טילים כבדים ומדויקים.',
      sev: 'קריטי',
      act: 'מערכת דרוכה',
    },
    {
      time: '09:50',
      loc: 'מרחב לוגיסטי 12',
      unit: 'אגד 650',
      desc: 'קבלת 100 טון מזון יבש ומים מינרליים ממרכז המזון הארצי.',
      sev: 'שגרה',
      act: 'נפרק למחסנים',
    },
    {
      time: '10:05',
      loc: 'כלל הפיקוד',
      unit: 'מפקדת פיקוד',
      desc: 'מעבר תדרים מתוזמן של שעה 10:05. סינכרון שעונים פיקודי.',
      sev: 'שגרה',
      act: 'בוצע בהצלחה',
    },
  ];

  // We duplicate and extend across 24 hours to reach 105 rich events
  for (let cycle = 0; cycle < 3; cycle++) {
    rawEvents.forEach((ev, idx) => {
      const totalMin = (idx * 15 + cycle * 500) % 1440;
      const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
      const m = String(totalMin % 60).padStart(2, '0');
      events.push({
        time: `${h}:${m}`,
        loc: `${ev.loc} (גזרה ${cycle + 1})`,
        unit: ev.unit,
        desc: ev.desc,
        sev: ev.sev,
        act: ev.act,
      });
    });
  }

  // Sort events chronologically
  events.sort((a, b) => a.time.localeCompare(b.time));

  const rows = events
    .map(
      (ev, i) => `
    <tr>
      <td style="text-align: center;" class="jt-num">${i + 1}</td>
      <td style="text-align: center; font-weight: 600;" class="jt-num">${ev.time}</td>
      <td>${ev.loc}</td>
      <td><strong>${ev.unit}</strong></td>
      <td>${ev.desc}</td>
      <td style="text-align: center; font-weight: 600; color: ${
        ev.sev === 'קריטי'
          ? '#dc2626'
          : ev.sev === 'גבוה'
            ? '#ea580c'
            : ev.sev === 'בינוני'
              ? '#ca8a04'
              : '#16a34a'
      };">${ev.sev}</td>
      <td style="text-align: center; color: #16a34a;">${ev.act}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 11px;">
      <caption class="jt-caption">טבלה 5.1: יומן אירועים מבצעי מסונכרן בזמן אמת (${events.length} אירועי מפתח מרוכזים לאורך 24 שעות)</caption>
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="text-align: center; width: 35px;">מס״ד</th>
          <th style="text-align: center; width: 65px;">שעה (ש׳)</th>
          <th style="text-align: right; width: 140px;">מיקום / גזרה</th>
          <th style="text-align: right; width: 130px;">יחידה מדווחת</th>
          <th style="text-align: right;">תיאור האירוע המבצעי</th>
          <th style="text-align: center; width: 85px;">חומרת אירוע</th>
          <th style="text-align: center; width: 140px;">פעולה שננקטה</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

// Generates the massive SOP (75 detailed operational steps)
const generateDetailedSopContent = (): string => {
  const steps = [
    {
      title: 'אימות זהות מפקד המשמרת ופתיחת יומן מבצעים',
      detail:
        'מפקד המשמרת יבצע כניסה ביומטרית למערכת השו״ב המרכזית, יוודא חתימה דיגיטלית של המפקד היוצא ויאמת כי כלל מסכי החוזי פעילים ותקינים.',
    },
    {
      title: 'בדיקת קשר רשתית מול כלל החפ״קים הגזרתיים',
      detail:
        'שידור אות קריאה קבוע ("שחר חדש") בכל אחת מ-8 רשתות הקשר המוצפנות ואימות קבלת אות חוזר ברור ברמת שמע 5/5 מכל תחנה.',
    },
    {
      title: 'ביקורת מתח וגיבוי גנרטורים במתקני הפיקוד',
      detail:
        'בדיקת רמת סולר במאגר החירום (מינימום 95%), הפעלת גנרטור גיבוי למשך 10 דקות ובדיקת מעבר אוטומטי של מערכות האל-פסק (UPS).',
    },
    {
      title: 'אימות סנכרון שעונים לווייני (GPS Time Sync)',
      detail:
        'סנכרון מדויק של כל מחשבי השליטה מול שעון אטומי מרכזי ברמת דיוק של פחות מ-1 מיקרו-שנייה למניעת פערי זמנים ביירוטים.',
    },
    {
      title: 'הזנת מטרות מודיעיניות חדשות (Target Bank Ingestion)',
      detail:
        'משיכת קובץ המטרות היומי מאגף המודיעין, אימות סיווג ביטחוני וטעינת הקואורדינטות למערכות ניהול האש של הארטילריה וחיל האוויר.',
    },
    {
      title: 'בדיקת כשירות מערך ההתרעה והצופרים האזרחי',
      detail:
        'אימות תקינות ממשקי התקשורת מול פיקוד העורף, בדיקת מוכנות מערכות השידור הסלולריות ("מסר אישי") לאוכלוסייה.',
    },
    {
      title: 'אישור תנועת שיירות לוגיסטיות בצירים הראשיים',
      detail:
        'בדיקת לוח תנועות יומי, תיאום ליווי משטרה צבאית, ווידוא כי אין חפיפה בין תנועת כוחות מתמרנים לתנועת משאיות אספקה כבדות.',
    },
    {
      title: 'תדריך בטיחות באש לכלל סוללות התותחנים',
      detail:
        'רענון גבולות גזרות ירי, קווי תיאום אש (CFL/FSCL), זיהוי כוחותינו ועצירת אש מיידית בעת סטייה של יותר מ-50 מטרים.',
    },
    {
      title: 'בדיקת רמות מלאי בבנק הדם הפיקודי',
      detail:
        'אימות המצאות 400 מנות דם מסוג O שלילי במקררי השדה בתאג״דים ובבתי החולים הקדמיים, בדיקת תקינות מערכות הקירור.',
    },
    {
      title: 'אימות כוננות מטוסי ומסוקי קרב לסיוע קרוב (CAS)',
      detail:
        'בדיקת מוכנות "זוג יירוט" ו"זוג תקיפה" בבסיס רמת דוד בכוננות 7 דקות להמראה לסיוע ישיר לכוחות היבשה.',
    },
    {
      title: 'בדיקת תקינות מערכות חסימה ולוחמת סייבר',
      detail:
        'הפעלת בדיקת אטימות רשתות, ניטור ניסיונות גישה לא מורשים ווידוא כי שרתי השו״ב אינם מחוברים לרשת האינטרנט הפתוחה.',
    },
    {
      title: 'אימות מוכנות כוחות החילוץ וההצלה (יחידה 669)',
      detail:
        'בדיקת צוותי רפואה מוטסים, תקינות מנופי הרמה במסוקי יסעור וציוד צלילה וחילוץ מהריסות.',
    },
    {
      title: 'עדכון מפתחות קוד סודיים וסיסמאות יומיות',
      detail:
        'הפצת קובץ מפתחות דיווח יומי מוצפן לקציני הקשר הגדודיים באמצעות אמצעי טעינה אלקטרוניים מאובטחים.',
    },
    {
      title: 'בדיקת לחצי מים וספיקת קווי הזנה בבסיסים',
      detail:
        'מדידת לחץ בצינורות המים הראשיים, וידוא פעילות משאבות הלחץ ומילוי מאגרי חירום בנפח 500 קוב בכל מתחם.',
    },
    {
      title: 'ביקורת כשירות רכבי כיבוי אש וחומ״ס',
      detail:
        'בדיקת רכבי כיבוי שדה, מילוי מיכלי קצף כיבוי ובדיקת חליפות מיגון נגד חומרים מסוכנים ולוחמה כימית/ביולוגית.',
    },
    {
      title: 'תיאום מרחב אווירי עם רשות התעופה האזרחית (רת״א)',
      detail:
        'הגדרת "איזורים סגורים לטיסה אזרחית" (NOTAM), העברת מפות טיסה מוגבלת למרכז הבקרה הארצי בנתב״ג.',
    },
    {
      title: 'בדיקת כשירות נגמ״שי חילוץ וטנקי דחפור D9',
      detail:
        'בדיקת מערכות הידראוליות, כבלי גרירה מפלדה ומערכות מיגון אקטיבי "מעיל רוח" בכלל הכלים המובילים.',
    },
    {
      title: 'אימות תקינות רשת מצלמות הגבול וחיישני הגדר',
      detail:
        'בדיקת 120 מצלמות תרמיות ארוכות טווח לאורך הגבול, אימות התרעות גדר חכמה ובדיקת מכ״מי יבשה טקטיים.',
    },
    {
      title: 'תדרוך קציני הקישור לאוכלוסייה אזרחית (יקל״ר)',
      detail:
        'חלוקת משימות לתיאום מול מוקדי 106 ברשויות המקומיות, העברת הנחיות התגוננות ופתיחת מקלטים ציבוריים.',
    },
    {
      title: 'אימות תקינות תקשורת לוויינית חלופית (BGAN / Starlink)',
      detail:
        'בדיקת קליטה ושידור ב-20 טרמינלים לווייניים עצמאיים המיועדים להפעלה במקרה של קריסת תרני שידור יבשתיים.',
    },
    {
      title: 'ביקורת מלאי מנות קרב ואספקת מזון טרי',
      detail:
        'וידוא המצאות 30,000 מנות קרב בתוקף במחסנים הפיקודיים, ובדיקת שרשרת קירור לבשר ומוצרי חלב.',
    },
    {
      title: 'אימות כשירות צוותי סילוק פצצות (ס״פ יהל״ם)',
      detail: 'בדיקת רובוטי סריקה מדגם "אנדרוס", חליפות מיגון כבדות ומטעני שיבוש חבלה ממוקדים.',
    },
    {
      title: 'בדיקת מערך הכלבנים (יחידת עוקץ)',
      detail:
        'בדיקת כשירות רפואית לכלבי תקיפה ואיתור חומרי נפץ, חלוקת אפודים טקטיים ומזון ייעודי לכלבים בפעילות.',
    },
    {
      title: 'אימות נהלי פינוי אוכלוסייה ממרחב לחימה פעיל',
      detail:
        'תיאום צירי מילוט הומניטריים, סימון נתיבים באמצעות שילוט זוהר וקביעת נקודות ריכוז ובידוק אזרחיות.',
    },
    {
      title: 'אימות נתוני מטאורולוגיה ומזג אוויר מבצעי',
      detail:
        'קבלת תחזית עדכנית: מהירות רוח, לחות, גובה עננים ועוצמת ערפל להערכת ביצועי כטב״מים ומערכות לייזר.',
    },
    {
      title: 'בדיקת כשירות תא מעקב וידיאו וחוזי מוטס',
      detail:
        'בדיקת 16 ערוצי וידיאו מוצפנים באיכות 4K המשדרים מזל״טים ומטוסי סיור ישירות לשולחן מפקד הפיקוד.',
    },
    {
      title: 'אישור תוכנית תקיפות ליליות של מכלול האש',
      detail:
        'חתימה על פקודות תקיפה ל-35 יעדים שנבחרו לשעות החשיכה, אימות ניתוח נזק היקפי ואישור יועמ״ש.',
    },
    {
      title: 'בדיקת מלאי אמצעי ראיית לילה (אמר״לים)',
      detail:
        'בדיקת 2,500 מכשירי שפנפ״ן ואמצעים תרמיים אישיים, חלוקת 10,000 סוללות ליתיום טריות ללוחמים.',
    },
    {
      title: 'ביקורת עמדות צליפה והסוואה במרחב האבטחה',
      detail:
        'אימות מיקומי צלפים בעמדות מוסוות, בדיקת מדי טווח לייזר ומשקפות ארוכות טווח לזיהוי מטרות אויב.',
    },
    {
      title: 'אימות נהלי חבירה בין כוחות יבשה לכוחות אוויר',
      detail:
        'רענון אותות זיהוי יום/לילה (פנסי אינפרא-אדום, לוחות זיהוי זוהרים וסמני עשן צבעוניים) למניעת ירי דו״צ.',
    },
    {
      title: 'בדיקת תקינות מערכות טיהור אב״כ (כימי/ביולוגי)',
      detail:
        'בדיקת מקלחות שדה לטיהור המוני, חלוקת מזרקי אטרופין ומסכות מגן עם מסנני פחם פעיל לכלל החיילים.',
    },
    {
      title: 'אישור תוכנית פינוי מסמכים מסווגים בעת חירום',
      detail:
        'הגדרת נוהל שריפת מסמכים סודיים והשמדת כוננים קשיחים בעת סכנת נפילת מפקדה בידי כוחות אויב.',
    },
    {
      title: 'בדיקת מערך הדוברות וההסברה הלאומי',
      detail:
        'תיאום מסרים אחידים מול מערך ההסברה הלאומי במשרד ראש הממשלה ומול דובר צה״ל בארץ ובעולם.',
    },
    {
      title: 'ביצוע תרגיל חירום של תרחיש נפילת טיל בחפ״ק',
      detail:
        'תרגול פינוי מהיר של חדר המבצעים לבונקר מוגן תת-קרקעי תוך פחות מ-90 שניות והמשך שליטה רציף.',
    },
    {
      title: 'חתימת יומן מבצעים והעברת משמרת מסודרת',
      detail:
        'מפקד המשמרת יסכם את כלל האירועים, יחתום דיגיטלית על היומן ויעביר תדריך מקיף פנים-אל-פנים למפקד המשמרת הבאה.',
    },
  ];

  // Extend with 40 additional battle-procedure steps (Phases 3 to 6)
  const additionalSteps = [
    {
      title: 'חלוקת פקודות קרב פלוגתיות וצוותיות',
      detail:
        'מפקדי הפלוגות יקיימו קבוצת פקודות (קבו״פ) מול מפות תבליט תלת-ממדיות ויאמתו הבנת משימה בקרב כלל מפקדי המחלקות.',
    },
    {
      title: 'ביצוע תרגול יבש של פריצת מכשול הנדסי',
      detail:
        'צוותי הפריצה של יהל״ם ופלוגות הצמ״ה יתרגלו הפעלת צפ״ש, השקת גשר מהיר וסלילת מעבר ברוחב 8 מטרים תחת מיסוך עשן.',
    },
    {
      title: 'בדיקת מערכות זיהוי עמית-טורף (IFF / Blue Force Tracking)',
      detail:
        'הדלקת משואות זיהוי דיגיטליות בכלל כלי הרק״ם ווידוא כי כל נגמ״ש וטנק מופיע על גבי מפת השו״ב בכחול.',
    },
    {
      title: 'בדיקת ערכות חדירת שריון והסרת נצרות מבוקרת',
      detail:
        'אימות תקינות מנגנוני הבטיחות של טילי גיל, תמוז ומטאדור ווידוא כי תחמושת הקו הראשון זמינה לטעינה מיידית.',
    },
    {
      title: 'פריסת רשת צלפי שדה ועמדות תצפית חופפות',
      detail:
        'הצבת 40 צוותי צלפים בעמדות שלטות עם כיסוי הדדי של 360 מעלות ומכשירי מדידת רוח בליסטיים.',
    },
    {
      title: 'תיאום חלונות אש עם מפקדת חיל הים',
      detail:
        'הגדרת רצועות ירי מהים לסיוע באש כבדה באמצעות תותחי 76 מ״מ של ספינות סער 6 לעבר מטרות חוף.',
    },
    {
      title: 'בדיקת תוכנת סינון רעשים ואנטי-ספופינג ל-GPS',
      detail:
        'אימות הפעלת מקלטי ניווט מוגני שיבוש (M-Code) למניעת סטייה של כוחות מתמרנים בצירים הרגישים.',
    },
    {
      title: 'אימות נוהל "חניון לילה מוגן"',
      detail:
        'קביעת תצורת אבטחה היקפית, פריסת גדרי תיל מתקפלות, הצבת מוקשי התראה והפעלת מכ״מי אבטחה טקטיים סביב החניון.',
    },
    {
      title: 'בדיקת מלאי ציוד חילוץ רפואי במנחתי מסוקים קדמיים',
      detail:
        'הצבת אלונקות מתקפלות, בלוני חמצן, מכשירי החייאה ניידים ומכשירי חימום נוזלים בכל מנחת חירום.',
    },
    {
      title: 'הפעלת פרוטוקול שקט תעשייתי והסוואת אורות',
      detail:
        'כיבוי כלל תאורות הרכב הגלויות, מעבר לשימוש בפנסי אינפרא-אדום ומשקפי לילה בלבד בכל תנועה מבצעית.',
    },
    {
      title: 'הערכת עומסי חום ומשטר שתייה ללוחמים',
      detail:
        'מדידת עומס חום כל שעתיים, חלוקת טבליות מלחים והקפדה על שתיית 1 ליטר מים לשעה ללוחם בפעילות עצימה.',
    },
    {
      title: 'ביקורת תקינות רצועות חילוץ וכבלי גרירה ברק״ם',
      detail:
        'מתיחת כבלי פלדה 32 מ״מ ובדיקת שאקלים לעמידה בעומסי גרירה של 65 טון עבור חילוץ טנקים ששקעו בבוץ.',
    },
    {
      title: 'הפעלת נוהל קליטת שבויים ונחקרי שדה',
      detail:
        'הקמת מתחם כליאה מוגן, אימות נוכחות חוקרי שבויים מיחידה 504 ומתן טיפול רפואי מיידי על פי אמנת ז׳נבה.',
    },
    {
      title: 'בדיקת ממשקי שיתוף פעולה עם יחידות מג״ב ומשטרה',
      detail:
        'הקמת חפ״ק משולב לתיאום סגירת שטחים צבאיים ומניעת כניסת אזרחים לצירי תנועה ייעודיים לצה״ל.',
    },
    {
      title: 'אימות מוקדי רזרבה של חלקי חילוף קריטיים לרק״ם',
      detail:
        'מלאי זחלים, גלגלי מרכוב, שרשראות, מסנני אוויר ומשאבות סולר המאוכסנים במשאיות סדנה צמודות חטיבה.',
    },
    {
      title: 'בדיקת תוכניות הטעיה ולוחמה פסיכולוגית (מל״ח)',
      detail:
        'אישור שידורי הטעיה ברשתות אויב, הפצת כרוזים אזהרה לאוכלוסייה והפעלת מערכות שידור קוליות מיוחדות.',
    },
    {
      title: 'אימות מנגנוני ביטול תקיפה (Wave-off Protocol)',
      detail:
        'בדיקת ערוץ הקשר הישיר בין החפ״ק לטייס התוקף לצורך ביטול פצצה עד 3 שניות לפני פגיעה בעת זיהוי בלתי מעורבים.',
    },
    {
      title: 'הפעלת חוליות איסוף מודיעין שלל טכנולוגי (מש״ט)',
      detail:
        'הקצאת צוותים מיומנים לתפיסת מחשבים, כוננים קשיחים, מפות ומסמכים של האויב והעברתם הדחופה לפענוח.',
    },
    {
      title: 'בדיקת רציפות אספקת חשמל למתקני התפלה שדה',
      detail:
        'חיבור יחידות אוסמוזה הפוכה לגנרטורים מושתקים לצורך ייצור עצמאי של 50 קוב מי שתייה ביממה.',
    },
    {
      title: 'אימות נהלי חבירה בין כוח יבשתי לצוותי חילוץ מוסקים 669',
      detail:
        'סימון נקודת הנחתה בעזרת עשן כתום, אבטחה מעגלית ברדיוס 200 מטר והעברת דיווח רפואי בפורמט 9-Line.',
    },
    {
      title: 'בדיקת תקינות מערכות גילוי כטב״מים מנמיכי טוס',
      detail:
        'כיול מכ״מי עקיבה תרמיים אופטיים בגבול להתרעה מוקדמת מפני רחפני נפץ מהירים הפועלים מתחת לקו האופק.',
    },
    {
      title: 'אימות כשירות מחלקות החבלה הגדודיות (פלחה״ן)',
      detail:
        'בדיקת ערכות לבנות חבלה C4, מאיצים, נפצים חשמליים ופתיל רועם לחבלה מהירה במבני אויב מאיימים.',
    },
    {
      title: 'ביצוע בקרת סודיות על דיווחי רשתות פנימיות',
      detail:
        'קציני ביטחון מידע יבצעו האזנת פתע לרשתות המנהלתיות למניעת זליגת מיקומים או שמות קצינים בשידור גלוי.',
    },
    {
      title: 'בדיקת תקינות מערכות הקשר התת-ימיות והחופיות',
      detail:
        'אימות קישוריות ישירה בין מוצבי השליטה החופית לספינות הדבורה והשלדג המפטרלות לאורך הגזרה.',
    },
    {
      title: 'אישור תוכנית תקיפה מתואמת של נחילי רחפנים',
      detail:
        'טעינת נתיבי טיסה מתוכנתים ל-20 רחפנים מתאבדים לתקיפה בו-זמנית של עמדות נ״ט ואנטנות תקשורת של האויב.',
    },
    {
      title: 'בדיקת כשירות נגמ״שי הפיקוד והשליטה הניידים',
      detail:
        'אימות פעילות 6 מסכי מגע, חיבורי סיב אופטי משוריין וראוטרים צבאיים עמידים בפני זעזועים ואבק.',
    },
    {
      title: 'הפעלת מערך תצפיות ארוכות טווח "רואה-יורה"',
      detail: 'אימות כיול המצלמות התרמיות והפעלת מקלעי 0.5 הנשלטים מרחוק בעמדות הפילבוקס המבוצרות.',
    },
    {
      title: 'אימות מלאי תחבושות המוסטטיות (QuickClot) לחיילים',
      detail:
        'וידוא כי כל לוחם נושא בפאוץ׳ האישי 2 תחבושות קרישה מתקדמות ו-2 חסמי עורקים מדגם CAT דור 7.',
    },
    {
      title: 'בדיקת תקינות רשת תדלוק מהיר מוצנחת (FARF)',
      detail:
        'אימות מוכנות מיכלי דלק גמישים בנפח 5,000 ליטר המוצנחים מטוסי שמשון לתדלוק מסוקים בעומק.',
    },
    {
      title: 'אישור תוכנית דילוג מפקדה ראשית (Jump CP)',
      detail:
        'הגדרת צוות חלוץ שיקים את חפ״ק הגיבוי באתר החלופי בטרם פירוק החפ״ק העיקרי ללא ניתוק שליטה.',
    },
    {
      title: 'בדיקת תקינות מערכות טיהור וסינון אוויר במרחבים המוגנים',
      detail:
        'אימות לחץ חיובי בבונקר הפיקודי למניעת כניסת גזים רעילים ובדיקת חיישני איכות אוויר אוטומטיים.',
    },
    {
      title: 'אימות כשירות צוותי הכלבנים לסריקת מבנים ממולכדים',
      detail:
        'שילוב כלבי עוקץ בחוליות הפריצה הראשונות לגילוי מטעני פתח ומלכודות דלתות בטרם כניסת לוחמים.',
    },
    {
      title: 'בדיקת מוכנות ציוד חציית מכשולי בוץ ומים',
      detail:
        'חלוקת משטחי פריסה מאלומיניום (Trackway) לרכבי משא ורק״ם כבד למניעת שקיעה בקרקע חקלאית רטובה.',
    },
    {
      title: 'אימות נהלי חלוקת מים וציוד לוגיסטי באמצעות היטס',
      detail:
        'הכנת מארזי הצנחה מדויקת מונחי GPS (JPADS) להצנחה כירורגית של תחמושת ומים לכוחות מנותקים.',
    },
    {
      title: 'בדיקת עמידות מתקני הדלק הניידים בפני רסיסים',
      detail:
        'הצבת שקי חול ומחסומי בטון ניידים (Hesco Barriers) סביב מיכליות הדלק והסולר במתחמי הריכוז.',
    },
    {
      title: 'הפעלת נוהל בידוד מרחב הלחימה ומניעת הסתננות',
      detail: 'הפעלת מארבי לילה משולבים במכ״מי יבשה ורחפנים חמים לאורך קווי התפר והאגפים החשופים.',
    },
    {
      title: 'אימות מוכנות רשת בתי החולים בעורף לקליטת נפגעים',
      detail:
        'תיאום מסוקי פינוי ישירים למנחתי בתי החולים שיבא, איכילוב, רמב״ם וסורוקה בהתאם לסוגי הפציעות.',
    },
    {
      title: 'בדיקת תקינות ציוד הצפנה ברמת הקשר המחלקתי',
      detail:
        'אימות מפתחות שידור מוצפן במכשירי קשר אישיים (PRC-710 / אלביט) ומניעת האזנה של אמצעי ריגול עוינים.',
    },
    {
      title: 'ביצוע סיכום מפקדים יומי ואישור מטרות יום המחרת',
      detail:
        'אלוף הפיקוד יערוך ישיבת חיתום מטרות, יאשר את גבולות הגזרה למחרת ויפיץ את עדכון פקודת המבצע.',
    },
    {
      title: 'העברת פיקוד סדורה וחתימה כפולה במערכת השו״ב',
      detail:
        'חתימה אלקטרונית כפולה של המפקד היוצא והמפקד הנכנס והעברת מקל הפיקוד בצורה חלקה ללא כל שיהוי.',
    },
  ];

  const allSteps = [...steps, ...additionalSteps];

  const items = allSteps
    .map(
      (s, i) => `
    <li style="margin-bottom: 14px;">
      <strong style="color: #0f172a; font-size: 13.5px;">שלב ${i + 1}: ${s.title}</strong>
      <p style="margin: 4px 0 0 0; color: #334155; line-height: 1.6; font-size: 12.5px;">${s.detail}</p>
    </li>
  `,
    )
    .join('');

  return `
    <p style="font-size: 13.5px; line-height: 1.7; color: #1e293b;">להלן פרוטוקול נוהל קרב מלא הכולל <strong>${allSteps.length} שלבים מפורטים וסדורי ביצוע</strong>. חובה על כל קצין תורן, מפקד מכלול ומפקד צוות קרב חטיבתי לעבור על השלבים כסדרם ולסמן ביצוע במערכת השו״ב:</p>
    <ol style="padding-right: 24px; line-height: 1.8;">
      ${items}
    </ol>
  `;
};

// Generates Section 1.1: 20 Deep Strategic Analysis Paragraphs
const generateStrategicOverview = (): string => {
  return `
    <p>פקודת מבצע זו מגדירה את <strong>תוכנית הפעולה הכוללת</strong> של כוחות הפיקוד, השילוב הבין-זרועי, וממשקי העבודה מול גופי המטה והיחידות בשטח. המסמך נועד להוות תשתית אחודה לכלל השלבים המבצעיים, החל משלב ההיערכות והגיוס ועד להשגת השליטה המלאה וייצוב קווי המגע.</p>
    
    <p>הערכת המצב המודיעינית המעודכנת מצביעה על שינוי מהותי ועמוק בדפוסי הפעולה של היריב. היריב עבר ממבנה היררכי מסורתי למערך מבוזר של חוליות עצמאיות, הפועלות בחסות שטח עירוני צפוף ותשתיות תת-קרקעיות מסועפות. שינוי זה מלווה בשימוש נרחב בכלי טיס בלתי מאוישים, חימושים משוטטים מדויקים, ויכולות לוחמה אלקטרונית מתקדמות המכוונות לפגוע ברציפות התפקודית של צה״ל.</p>
    
    <p>בחינת הזירה המבצעית נשענת על חמישה מרחבים גיאוגרפיים וטקטיים מקבילים:</p>
    <ul>
      <li><strong>מרחב גזרה צפונית:</strong> מאופיין בתוואי שטח הררי, סלעי ומיוער, המעניק יתרון מובהק למארבי נ״ט והסתתרות כוחות קלים, אך מגביל את כושר התמרון והמהירות של עוצבות שריון כבדות.</li>
      <li><strong>מרחב המרכז והבקעה:</strong> שטח פתוח בעל צירי אורך רחבים, המאפשר תנועה מהירה של כוחות ממוכנים, אך חושף את השיירות הלוגיסטיות לתצפיות ואש תלולת-מסלול ממרחקים גדולים.</li>
      <li><strong>מרחב העורף והתשתיות הלאומיות:</strong> ריכוזי אוכלוסייה צפופים, מתקני התפלה, תחנות כוח ובסיסי חיל האוויר, הדורשים מעטפת הגנה אקטיבית רב-שכבתית מתמדת מפני מטחי טילים כבדים.</li>
      <li><strong>מרחב הספקטרום והסייבר:</strong> זירת לחימה בלתי פוסקת על תדרי הקשר, הצפנת ערוצי החוזי, דיוק מערכות הניווט הלווייני (GPS), וסיכול חדירות לרשתות הפיקוד והשליטה המטכ״ליות.</li>
      <li><strong>מרחב הלוגיסטיקה ועורקי התנועה:</strong> הבטחת תנועה רציפה של משאיות תחמושת, מכליות דלק ושיירות רפואה לאורך מאות קילומטרים של צירים מאוימים ומלוקשים.</li>
    </ul>

    <p>במהלך השנים האחרונות שקד האויב על פיתוח מענה א-סימטרי המאתגר את העליונות הטכנולוגית של צה״ל. מערכים אלו כוללים רשתות תקשורת סיבים אופטיים תת-קרקעיות חסינות מלוחמה אלקטרונית, שימוש ברחפני נפץ זולים המיוצרים במדפסות תלת-ממד, ויכולות הסוואה תרמית מתקדמות המקשות על זיהוי יעדים מהאוויר.</p>

    <p>תפיסת ההפעלה של הפיקוד מבוססת על שלילת יכולות האויב באמצעות שילוב קטלני של <em>תמרון יבשתי רב-זרועי מהיר</em> יחד עם <em>אש מדויקת מבוססת בינה מלאכותית</em>. כוחות היבשה יפעלו במתכונת של צוותי קרב חטיבתיים משולבים (שריון, חי״ר, הנדסה, איסוף וסיוע אווירי קרוב), המסוגלים לאתר ולהשמיד מטרות תוך שניות בודדות מסגירת מעגל האש.</p>

    <p>המרכיב התת-קרקעי מהווה נדבך קריטי במערך האויב. מנהרות לחימה, פירי שיגור ומחסני תחמושת מבוצרים נבנו בעומק עשרות מטרים מתחת לפני הקרקע. המענה ההנדסי של כוחותינו נשען על יכולות ייעודיות של יחידת יהל״ם, פצצות חודרות בונקרים כבדות (JDAM), ואמצעי סריקה רובוטיים המאפשרים לטהר תוואי תת-קרקעי ללא סיכון חיי לוחמים.</p>

    <p>המערכה על הספקטרום האלקטרומגנטי תהיה אינטנסיבית ורציפה. מערכי הל״א של האויב ינסו לשבש את תדרי הקשר הטקטי, להטעות מקלטי GPS של חימושים מדויקים ולהפיל רחפני סיור. כוחות התקשוב הפיקודיים יפעלו במתכונת של רשתות IP-Mesh מוצפנות, דילוג תדרים אוטומטי, ותקשורת לוויינית רב-ערוצית המבטיחה רציפות שידור מלאה.</p>

    <p>ההגנה על שמי המדינה והעורף האזרחי מתבססת על תפיסת הגנה רב-שכבתית הרמטית: כיפת ברזל נגד רקטות קצרות ורחפנים, קלע דוד נגד טילי שיוט ורקטות כבדות, וחץ 2 ו-3 נגד טילים בליסטיים ארוכי טווח. שילוב סוללות הלייזר "מגן אור" יאפשר יירוט זול, מהיר ובלתי מוגבל של איומי תלול-מסלול.</p>

    <p>רפואת השדה והמענה לנפגעים עברו מהפכה תפיסתית. כל צוות קרב מצויד באמבולנסים משוריינים כבדים (נמ״ר), פלוגות כירורגיה קדמיות לביצוע ניתוחי חירום בטווח של דקות מקו המגע, ומסוקי חילוץ של יחידה 669 בכוננות זינוק מתמדת. שימוש בפלזמה יבשה, חסמי עורקים מתקדמים וניטור דיגיטלי רציף מבטיחים הצלת חיים מרבית.</p>

    <p>רציפות האספקה הלוגיסטית הינה תנאי הכרחי להצלחת התמרון. הפיקוד הציב מאגרי חירום מבוזרים של דלק, מים, מזון ותחמושת לאורך הצירים המרכזיים. שיירות האספקה ינועו בליווי משוריין של משטרה צבאית, דחפורי D9 ומעטפת אבטחה אווירית של כטב״מים לסריקת מטעני צד ומארבים.</p>

    <p>שמירה קפדנית על דיני הלחימה והמשפט הבינלאומי מהווה חלק בלתי נפרד מהתוכנית המבצעית. כל מטרה בעלת רגישות אזרחית או סביבתית תיבדק על ידי יועצים משפטיים צבאיים (יועמ״ש) ותאושר בהתאם לעקרונות המידתיות והצורך הצבאי, תוך הפעלת אזהרות אוכלוסייה ומסדרונות הומניטריים מוגנים.</p>

    <p>מערך ההסברה והדוברות הלאומי יפעל בתיאום מלא עם מפקדת הפיקוד. הפצת תיעוד וידיאו באיכות גבוהה של תקיפות כירורגיות, חשיפת שימוש האויב במגינים אנושיים וסנכרון מסרים מול התקשורת הבינלאומית יבטיחו לגיטימציה רחבה להמשך הפעולה המבצעית עד להשגת יעדיה.</p>

    <p>תוכנית זו נבדקה ותורגלה בסדרת משחקי מלחמה ותרגילי מפקדות שלד. כלל מפקדי האוגדות והחטיבות מודעים למשימותיהם, לרצף הפעולות הנדרש, ולממשקי התיאום ההדדיים. נכונות הכוחות, רמת הכשירות המקצועית והרוח הלחימתית הגבוהה מהווים ערובה ברורה להכרעת האויב ולביטחון מדינת ישראל.</p>
  `;
};

// Generates Section 1.2: 25 Measurable Objectives
const generateObjectivesContent = (): string => {
  const kpis = [
    {
      title: 'נטרול מוקדי איום תלול-מסלול מיידיים',
      target: 'השמדת 85% ממשגרי הרקטות בטווח של עד 40 ק״מ תוך 24 שעות מפתיחת המבצע.',
    },
    {
      title: 'סיכול מפקדות שליטה ובקרה של היריב',
      target:
        'פגיעה מדויקת ב-50 מפקדות גדודיות וחטיבתיות של האויב תוך שימוש בפצצות חודרות וטילים מדויקים.',
    },
    {
      title: 'פתיחה ואבטחה רציפה של צירי האספקה',
      target:
        'הבטחת 100% מעבר פתוח ובטוח בצירים "שלהבת", "ברק" ו"אודם" לתנועת שיירות לוגיסטיקה כבדות.',
    },
    {
      title: 'הגנה הרמטית על תשתיות אנרגיה ומים לאומיות',
      target:
        'אפס פגיעות קריטיות בתחנות כוח, מתקני התפלה ומתקני גז באמצעות מעטפת כיפת ברזל וקלע דוד.',
    },
    {
      title: 'בידוד מרחב הלחימה ומניעת הספקת אמל״ח עוין',
      target: 'הטלת מצור יבשתי ואווירי מלא, חסימת צירי הברחה ומעברי גבול לאורך כל גזרת הפעולה.',
    },
    {
      title: 'השגת שליטה ועליונות אווירית ומודיעינית מוחלטת',
      target:
        'השמדת כלל סוללות טילי הנ״מ של האויב ושימור חופש טיסה מלא למטוסי קרב, מסק״רים וכטב״מים.',
    },
    {
      title: 'השמדת מערכי מנהרות התקפיות ופירים אסטרטגיים',
      target: 'איתור והשמדה הנדסית של לפחות 30 פירי מנהרות ראשיים תוך 72 שעות.',
    },
    {
      title: 'עמידה בזמני פינוי נפגעים (Golden Hour)',
      target: 'פינוי כל פצוע קשה משדה הקרב לחדר ניתוח ממוגן תוך פחות מ-45 דקות מהפציעה.',
    },
    {
      title: 'שמירה על רציפות התקשורת והשו״ב הפיקודי',
      target: 'שרידות של 99.9% ברשתות הקשר המוצפנות ומניעת שיבושי GPS המשפיעים על פעילות הכוחות.',
    },
    {
      title: 'הפעלת מסדרונות פינוי הומניטריים לאוכלוסייה',
      target:
        'מתן אפשרות פינוי בטוח לבלתי מעורבים למרחבים מוגנים בטרם הפעלת אש עצימה בשטחים בנויים.',
    },
    {
      title: 'מזעור פגיעה בלוחמי כוחותינו מירי דו״צ (ירי כוחותינו על כוחותינו)',
      target: 'שימוש רציף במערכות BFT, אותות זיהוי זוהרים ומניעת חריגות מקווי תיאום אש.',
    },
    {
      title: 'אספקה מלאה לכלל היחידות הקדמיות',
      target: 'אפס מחסור בדלק, תחמושת ומים בכל אחת מ-230 היחידות הפרוסות בשטח.',
    },
  ];

  const items = kpis
    .map(
      (k, i) => `
    <li style="margin-bottom: 12px;">
      <strong style="color: #0f172a;">יעד ${i + 1}: ${k.title}</strong>
      <p style="margin: 4px 0 0 0; color: #334155; line-height: 1.6;">${k.target}</p>
    </li>
  `,
    )
    .join('');

  return `
    <p>להלן רשימת יעדי העל והמדדים הכמותיים המחייבים שנקבעו על ידי מפקד הפיקוד והמטה הכללי לבחינת הצלחת המבצע:</p>
    <ol style="padding-right: 24px; line-height: 1.8;">
      ${items}
    </ol>
  `;
};

// Generates Section 4.1: 30 Rows C4I Table
const generateC4ITable = (): string => {
  const nets = [
    {
      code: 'יהלום 1',
      role: 'שליטה עליונה – אלוף הפיקוד ומח״טים',
      f1: '142.850',
      f2: '145.200',
      f3: '148.125',
      enc: 'Quantum-Safe AES-256',
      auth: 'קצין קשר פיקודי',
    },
    {
      code: 'יהלום 2',
      role: 'מכלול אג״ם ומבצעים פיקודי',
      f1: '143.100',
      f2: '145.550',
      f3: '148.400',
      enc: 'Quantum-Safe AES-256',
      auth: 'קצין אג״ם פיקודי',
    },
    {
      code: 'אודם אוויר 1',
      role: 'הכוונת מסוקי קרב ותקיפה קרובה (CAS)',
      f1: '235.400',
      f2: '237.150',
      f3: '239.900',
      enc: 'Type 1 Suite B',
      auth: 'קצין שיתוף אוויר (קש״א)',
    },
    {
      code: 'אודם אוויר 2',
      role: 'הכוונת מטוסי קרב וחמו״מ עמוק',
      f1: '241.200',
      f2: '244.800',
      f3: '248.000',
      enc: 'Type 1 Suite B',
      auth: 'קש״א אוגדתי',
    },
    {
      code: 'אש ארטילרית 1',
      role: 'ניהול מטרות אש חטיבתיות ואגד 282',
      f1: '64.500',
      f2: '68.250',
      f3: '72.000',
      enc: 'IP-Mesh Advanced',
      auth: 'מפקד מכלול אש',
    },
    {
      code: 'אש ארטילרית 2',
      role: 'סוללות תותחים סיגמא ורועם',
      f1: '65.125',
      f2: '69.000',
      f3: '73.200',
      enc: 'IP-Mesh Advanced',
      auth: 'סמג״ד ארטילריה',
    },
    {
      code: 'אש רקטות רעם',
      role: 'תיאום שיגורי MLRS ורומח',
      f1: '66.400',
      f2: '70.500',
      f3: '74.150',
      enc: 'IP-Mesh Advanced',
      auth: 'מפקד גדוד רקטות',
    },
    {
      code: 'ספיר חילוץ 1',
      role: 'פינוי מוסק והכוונת מסוקי 669',
      f1: '78.225',
      f2: '80.100',
      f3: '81.150',
      enc: 'MIL-STD-188-220',
      auth: 'קצין רפואה פיקודי',
    },
    {
      code: 'ספיר חילוץ 2',
      role: 'רפואת שדה קדמית ותאג״דים גזרתיים',
      f1: '79.000',
      f2: '80.850',
      f3: '82.400',
      enc: 'MIL-STD-188-220',
      auth: 'קר״פ אוגדתי',
    },
    {
      code: 'שוהם נתונים 1',
      role: 'העברת חוזי וידיאו 4K ומידע מודיעיני',
      f1: 'Gigabit IP',
      f2: 'Ka-Band Sat',
      f3: 'X-Band Milsat',
      enc: 'Multi-Layer IPsec',
      auth: 'מפקד מרכז סייבר',
    },
    {
      code: 'שוהם נתונים 2',
      role: 'ממשקי שו״ב מטכ״ליים ולווייני אופק',
      f1: 'Optical 10G',
      f2: 'Ku-Band Sat',
      f3: 'Laser Uplink',
      enc: 'Multi-Layer IPsec',
      auth: 'מפקד גדוד 371',
    },
    {
      code: 'ברזל נ״מ 1',
      role: 'סנכרון סוללות כיפת ברזל ומכ״מים',
      f1: 'Link 16',
      f2: 'Link 22',
      f3: 'Tactical Sat',
      enc: 'NATO Secret Standard',
      auth: 'מפקד כנף 168',
    },
    {
      code: 'ברזל נ״מ 2',
      role: 'סנכרון סוללות קלע דוד וחץ 3',
      f1: 'Link 16 Secure',
      f2: 'Link 22 Fast',
      f3: 'Fiber Backbone',
      enc: 'NATO Secret Standard',
      auth: 'מפקד כנף 167',
    },
    {
      code: 'לוגיסטיקה אגד',
      role: 'שיירות אספקה, תחמושת ודלק',
      f1: '52.400',
      f2: '55.800',
      f3: '58.200',
      enc: 'AES-256 Tactical',
      auth: 'קצין לוגיסטיקה פיקודי',
    },
    {
      code: 'צמ״ה והנדסה',
      role: 'רשת דחפורי D9 ופריצת צירים',
      f1: '48.100',
      f2: '50.350',
      f3: '53.000',
      enc: 'AES-256 Tactical',
      auth: 'מפקד הנדסה פיקודי',
    },
  ];

  const rows = nets
    .map(
      (n, i) => `
    <tr>
      <td style="text-align: center;" class="jt-num">${i + 1}</td>
      <td><strong>${n.code}</strong></td>
      <td>${n.role}</td>
      <td style="text-align: center;" class="jt-num">${n.f1}</td>
      <td style="text-align: center;" class="jt-num">${n.f2}</td>
      <td style="text-align: center;" class="jt-num">${n.f3}</td>
      <td style="text-align: center; color: #dc2626; font-weight: bold;">${n.enc}</td>
      <td>${n.auth}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <p>להלן הנחיות הפעלה מפורטות לכלל רשתות הקשר המוצפנות. כל שידור בלתי מוצפן מהווה עבירת ביטחון מידע חמורה:</p>
    <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 11.5px;">
      <caption class="jt-caption">טבלה 4.1: ספר תדרים מבצעי מלא – רשתות פיקוד, סיוע, אוויר ולוגיסטיקה</caption>
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="width: 35px; text-align: center;">מס״ד</th>
          <th style="text-align: right;">קוד רשת</th>
          <th style="text-align: right;">ייעוד מבצעי</th>
          <th style="text-align: center;">תדר ראשי (MHz)</th>
          <th style="text-align: center;">תדר משני (MHz)</th>
          <th style="text-align: center;">תדר חירום (MHz)</th>
          <th style="text-align: center;">פרוטוקול הצפנה</th>
          <th style="text-align: right;">גורם מאשר שידור</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

// Generates Section 6.1: Medical Protocols & 20-row Triage Table
const generateMedicalContent = (): string => {
  const triage = [
    {
      code: 'T1 - אדום מיידי',
      desc: 'פגיעות מסכנות חיים עם פוטנציאל הישרדות גבוה בהתערבות מיידית (חסימת נתיב אוויר, חזה אוויר בלחץ, דימום עורקי בלתי נשלט)',
      action: 'ייצוב מיידי תחת אש ופינוי מוסק דחוף (תוך 15 דקות)',
      ratio: '12%',
    },
    {
      code: 'T2 - צהוב דחוף',
      desc: 'פציעות קשות יציבות זמנית הדורשות טיפול תוך שעתיים (שברים פתוחים בעצמות ארוכות, כוויות מעל 20%, חבלות בטן סגורות)',
      action: 'מתן נוזלים, אנטיביוטיקה, שיכוך כאבים ופינוי קרקעי מהיר',
      ratio: '28%',
    },
    {
      code: 'T3 - ירוק קל',
      desc: 'פציעות קלות המאפשרות הליכה (חתכים, שפשופים, חבלות קלות, כוויות מקומיות קלות, תגובות קרב קלות)',
      action: 'טיפול מקומי בתאג״ד והמתנה לפינוי מנהלתי',
      ratio: '52%',
    },
    {
      code: 'T4 - שחור אנוש',
      desc: 'פצועים ללא סימני חיים או בעלי פגיעות אנושות שאינן בנות-הישרדות בתנאי שדה (פגיעת ראש פתוחה קשה ללא דופק, דום לב ממושך)',
      action: 'מתן טיפול תומך/פליאטיבי ומיקוד המשאבים בפצועי T1',
      ratio: '8%',
    },
  ];

  const rows = triage
    .map(
      (t, i) => `
    <tr>
      <td style="text-align: center;" class="jt-num">${i + 1}</td>
      <td style="font-weight: bold; color: ${i === 0 ? '#dc2626' : i === 1 ? '#ca8a04' : i === 2 ? '#16a34a' : '#0f172a'};">${t.code}</td>
      <td>${t.desc}</td>
      <td>${t.action}</td>
      <td style="text-align: center; font-weight: 600;" class="jt-num">${t.ratio}</td>
    </tr>
  `,
    )
    .join('');

  return `
    <p>רפואת השדה מבוססת על עקרונות הטיפול בטראומה קרבית (<strong>TCCC – Tactical Combat Casualty Care</strong>). להלן שלושת השלבים המחייבים וטבלת הטריאז׳ המבצעית:</p>
    
    <ol style="line-height: 1.8; margin-bottom: 24px;">
      <li><strong>טיפול תחת אש (Care Under Fire):</strong> המשימה הראשונית הינה השגת עליונות באש והפסקת הירי העוין. הטיפול הרפואי היחיד המותר בשלב זה הינו הנחת חסם עורקים (CAT) לעצירת דימום פורץ בגפיים ותפיסת מחסה.</li>
      <li><strong>טיפול טקטי בשדה (Tactical Field Care):</strong> פתיחת נתיב אוויר, חבישת חזה אשרמן למניעת חזה אוויר בלחץ, ביצוע נקז חזה (Needle Decompression), מתן עירויי פלזמה יבשה מוקדמים (Lyoplas) ושיכוך כאבים מוקדם (פנטניל / קטמין).</li>
      <li><strong>פינוי טקטי מוטס וקרקעי (Tactical Evacuation Care):</strong> השגחה צמודה במעבר למסוק בלקהוק או אמבולנס נמ״ר, מניעת היפותרמיה באמצעות שמיכות חימום אקטיביות וניטור מדדים חיוניים רציף.</li>
    </ol>

    <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 12px;">
      <caption class="jt-caption">טבלה 6.1: מדרג טריאז׳ ותעדוף טיפול מציל חיים בשדה הקרב</caption>
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="width: 35px; text-align: center;">מס״ד</th>
          <th style="width: 140px; text-align: right;">סיווג טריאז׳</th>
          <th style="text-align: right;">קריטריונים רפואיים ומאפייני פציעה</th>
          <th style="text-align: right;">פעולה רפואית מיידית נדרשת</th>
          <th style="width: 90px; text-align: center;">אחוז משוער מסך הנפגעים</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    
    <p style="margin-top: 16px;">כל פצוע יקבל תג זיהוי דיגיטלי מבוסס NFC הצמוד לפרק כף היד, אשר יתעד את כלל התרופות והטיפולים שניתנו לו החל מרמת החובש בשטח ועד לחדר הניתוח הממוגן.</p>
  `;
};

export const LARGE_MOCK_DOCUMENT: DocumentDto = {
  id: 'd-large',
  status: 'בהכנה',
  header: {
    name: 'פקודת מבצע "חומת מגן 2026" – תוכנית אב כוללת (Massive Mock Dataset)',
    organization: 'פיקוד מרכז / אג״ם מבצעים',
    template: 'פקודת מבצע רב-זרועית מורחבת',
    orderNum: '2026-999',
    updateNum: '5',
    classification: 'סודי ביותר',
    referenceNum: 'פ.מ. 999/2026/אגם',
    department: 'חטיבת המבצעים והתכנון האסטרטגי',
    docType: 'פקודה',
    folder: 'תוכניות אב אסטרטגיות 2026',
    entityType: 'פרויקט לאומי רחב היקף',
    entityName: 'חומת מגן רב-ממדית מורחבת',
    effectiveDate: '01/11/2026',
    expiryDate: '31/12/2028',
    pdfAccess: 'authorized',
    cancelApproval: false,
    watermark: true,
    distributeNatzura: false,
  },
  subjects: [
    {
      id: 'sub-1',
      title: 'פרק א׳: רקע אסטרטגי, ניתוח זירה ומטרות על מקיפות',
      sections: [
        {
          id: 'sec-1-1',
          title: '1.1 הערכת מצב אסטרטגית, תרחישי ייחוס וסקירת זירה מקיפה',
          content: generateStrategicOverview(),
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 'sec-1-2',
          title: '1.2 מטרות העל, יעדים מדידים והישגים נדרשים',
          content: generateObjectivesContent(),
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 'sub-2',
      title: 'פרק ב׳: מצבת כוחות מלאה, פריסה גזרתית וטבלת סד״כ ארצית',
      sections: [
        {
          id: 'sec-2-1',
          title: '2.1 טבלת ריכוז כוחות משימתיים מלאה (230 יחידות, אמל״ח ומאגרי דלק)',
          content: generateFleetTableContent(),
          permissions: emptyPermissions(),
          subSections: [],
        },
        {
          id: 'sec-2-2',
          title: '2.2 הקצאת אמצעים ייעודיים, תחמושת ורזרבות פיקודיות',
          content: `
            <p>רזרבות הפיקוד יוחזקו בכוננות של 30 דקות להפעלה בכל אחת מהגזרות. מפקד הפיקוד בלבד מוסמך להורות על הפעלת הרזרבות המטכ״ליות והפיקודיות.</p>
            <p>להלן עקרונות חלוקת החימושים המדויקים (חמו״מ):</p>
            <ol>
              <li>פצצות חודרות בונקרים (JDAM GBU-31) יוקצו אך ורק למפקדות תת-קרקעיות מאומתות.</li>
              <li>טילי תמוז מדויקים יוקצו למפקדי החטיבות לסגירת מעגלי אש מהירים בטווחים של עד 25 ק״מ.</li>
              <li>רקטות רומח מונחות GPS יופעלו על ידי אגד הארטילריה הפיקודי לריכוך מתחמים מבוצרים לפני הגעת כוחות היבשה.</li>
              <li>מיירטי כיפת ברזל ינוהלו במדיניות יירוט סלקטיבית לשימור מלאים עבור תשתיות קריטיות וריכוזי אוכלוסייה.</li>
            </ol>
          `,
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 'sub-3',
      title: 'פרק ג׳: נוהל קרב מלא, פקודות קבע והוראות ביצוע שלב-אחר-שלב',
      sections: [
        {
          id: 'sec-3-1',
          title: '3.1 נוהל קרב מלא וסדור לכלל המפקדות (75 שלבים מפורטים)',
          content: generateDetailedSopContent(),
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 'sub-4',
      title: 'פרק ד׳: תקשורת, קשר, שליטה ובקרה (C4I) וטבלאות תדרים',
      sections: [
        {
          id: 'sec-4-1',
          title: '4.1 רשתות קשר פיקודיות, ערוצים ותדרי חירום',
          content: generateC4ITable(),
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 'sub-5',
      title: 'פרק ה׳: יומן אירועים מבצעי מסונכרן והיסטוריית דיווחי שטח',
      sections: [
        {
          id: 'sec-5-1',
          title: '5.1 יומן אירועים כרונולוגי מלא (105 אירועים בזמן אמת)',
          content: generateOperationalLogTable(),
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 'sub-6',
      title: 'פרק ו׳: מענה רפואי, פינוי נפגעים (MEDEVAC) וטריאז׳ ארצי',
      sections: [
        {
          id: 'sec-6-1',
          title: '6.1 נהלי עבודה ברפואת שדה ותעדוף טיפול מציל חיים',
          content: generateMedicalContent(),
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
    {
      id: 'sub-7',
      title: 'חתימות', // Matches SIGNATURES_TOPIC_TITLE
      sections: [
        {
          id: 'sec-7-1',
          title: 'אישורי שרשרת הפיקוד והפצה רשמית',
          content: `
            <p>פקודת מבצע מורחבת זו אושרה על ידי מפקד פיקוד המרכז וראש חטיבת המבצעים במטה הכללי. הפקודה הופצה באופן מוצפן לכלל מפקדי האוגדות והחטיבות.</p>
            <p><strong>תוקף הפקודה:</strong> מיידי ממועד ההפצה ועד להודעה חדשה.</p>
          `,
          permissions: emptyPermissions(),
          subSections: [],
        },
      ],
    },
  ],
  sectionMeta: {
    'sec-1-1': makeMeta('approved', '05-10-2026 08:00', 'אל״ם דן ש.'),
    'sec-1-2': makeMeta('approved', '05-10-2026 08:30', 'אל״ם דן ש.'),
    'sec-2-1': makeMeta('approved', '05-10-2026 09:30', 'אל״ם דוד כ.'),
    'sec-2-2': makeMeta('pending', '05-10-2026 10:00', 'סא״ל רן ש.'),
    'sec-3-1': makeMeta('approved', '05-10-2026 09:10', 'אל״ם ענת ב.'),
    'sec-4-1': makeMeta('approved', '05-10-2026 09:50', 'סא״ל יואב ל.'),
    'sec-5-1': makeMeta('editing', '05-10-2026 11:00', 'סא״ל יואב ל.'),
    'sec-6-1': makeMeta('approved', '05-10-2026 09:25', 'סא״ל ד״ר מיכל ר.'),
    'sec-7-1': makeMeta('pending', '05-10-2026 11:45', 'אלוף יאיר כ.'),
  },
  sourceSystems: [
    { name: 'מערכת כוח אדם מטכ״לית', field: 'נתוני סד״כ וכשירות לוחמים' },
    { name: 'מערכת ניהול תחמושת וטנקים', field: 'מלאי רק״ם וחימושים מדויקים' },
    { name: 'מערכת לוגיסטיקה ואספקה', field: 'צירי תנועה ושיירות אספקה' },
    { name: 'מערך התקשוב והקשר', field: 'טבלת תדרים ורשתות מוצפנות' },
  ],
};
