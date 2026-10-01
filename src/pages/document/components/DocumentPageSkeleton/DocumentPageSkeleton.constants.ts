export const LETTERHEAD_FIELD_WIDTHS = ['180px', '140px', '210px', '120px', '160px'];

export const OUTLINE_ROWS = [
  { id: 'subject-1', width: '70%', indented: false },
  { id: 'section-1', width: '58%', indented: true },
  { id: 'section-2', width: '64%', indented: true },
  { id: 'subject-2', width: '52%', indented: false },
  { id: 'section-3', width: '61%', indented: true },
  { id: 'section-4', width: '46%', indented: true },
];

export const PAPER_SUBJECTS = [
  {
    id: 'paper-subject-1',
    titleWidth: '46%',
    sections: [
      {
        id: 'paper-section-1',
        titleWidth: '38%',
        lines: [
          { id: 'l1', width: '100%' },
          { id: 'l2', width: '92%' },
          { id: 'l3', width: '76%' },
        ],
      },
      {
        id: 'paper-section-2',
        titleWidth: '44%',
        lines: [
          { id: 'l1', width: '100%' },
          { id: 'l2', width: '84%' },
        ],
      },
    ],
  },
  {
    id: 'paper-subject-2',
    titleWidth: '52%',
    sections: [
      {
        id: 'paper-section-3',
        titleWidth: '35%',
        lines: [
          { id: 'l1', width: '100%' },
          { id: 'l2', width: '88%' },
          { id: 'l3', width: '61%' },
        ],
      },
    ],
  },
];
