import { expect, test } from '@playwright/test';
import { flattenDocumentNodes } from '../../../../src/pages/document/components/PaperCanvas/components/PaperSubjectList/flattenDocumentNodes';
import { SIGNATURES_TOPIC_TITLE } from '../../../../src/pages/document/components/SignaturesSection/SignaturesSection.constants';
import type { NumberedSubject } from '../../../../src/pages/document/document.numbering';

test('flattenDocumentNodes flattens nested document tree into independent virtual nodes', () => {
  const subjects: NumberedSubject[] = [
    {
      subject: {
        id: 'subj-1',
        title: 'מבוא',
        sections: [
          {
            id: 'sec-1-1',
            title: 'סעיף ראשון',
            content: 'תוכן',
            subSections: [
              { id: 'sub-1-1-a', title: 'תת סעיף א', content: '' },
              { id: 'sub-1-1-b', title: 'תת סעיף ב', content: '' },
            ],
          },
          {
            id: 'sec-1-2',
            title: 'סעיף שני',
            content: '',
            subSections: [],
          },
        ],
      },
      firstSectionNumber: 1,
    },
    {
      subject: {
        id: 'subj-2',
        title: 'רקע',
        sections: [
          {
            id: 'sec-2-1',
            title: 'סעיף שלישי',
            content: '',
            subSections: [],
          },
        ],
      },
      firstSectionNumber: 3,
    },
    {
      subject: {
        id: 'subj-sig',
        title: SIGNATURES_TOPIC_TITLE,
        sections: [],
      },
      firstSectionNumber: 4,
    },
  ];

  const nodes = flattenDocumentNodes(subjects, new Set(), () => false);

  // 1 subject header + (1 section + 2 subsections) + (1 section) + 1 subject header + 1 section + 1 signatures = 8 nodes
  expect(nodes).toHaveLength(8);

  expect(nodes[0]).toEqual({
    type: 'subject',
    id: 'subj-1',
    subject: subjects[0].subject,
    isFirst: true,
  });

  expect(nodes[1]).toEqual({
    type: 'section',
    id: 'sec-1-1',
    subjectId: 'subj-1',
    section: subjects[0].subject.sections[0],
    number: 1,
    hasSubSections: true,
  });

  expect(nodes[2]).toEqual({
    type: 'subSection',
    id: 'sub-1-1-a',
    subjectId: 'subj-1',
    sectionId: 'sec-1-1',
    subSection: subjects[0].subject.sections[0].subSections[0],
    index: 0,
    isLast: false,
  });

  expect(nodes[3]).toEqual({
    type: 'subSection',
    id: 'sub-1-1-b',
    subjectId: 'subj-1',
    sectionId: 'sec-1-1',
    subSection: subjects[0].subject.sections[0].subSections[1],
    index: 1,
    isLast: true,
  });

  expect(nodes[4]).toEqual({
    type: 'section',
    id: 'sec-1-2',
    subjectId: 'subj-1',
    section: subjects[0].subject.sections[1],
    number: 2,
    hasSubSections: false,
  });

  expect(nodes[5]).toEqual({
    type: 'subject',
    id: 'subj-2',
    subject: subjects[1].subject,
    isFirst: false,
  });

  expect(nodes[6]).toEqual({
    type: 'section',
    id: 'sec-2-1',
    subjectId: 'subj-2',
    section: subjects[1].subject.sections[0],
    number: 3,
    hasSubSections: false,
  });

  expect(nodes[7]).toEqual({
    type: 'signatures',
    id: 'subj-sig',
    subject: subjects[2].subject,
  });
});

test('flattenDocumentNodes omits subsections when parent section is hidden or filtered', () => {
  const subjects: NumberedSubject[] = [
    {
      subject: {
        id: 'subj-1',
        title: 'נושא',
        sections: [
          {
            id: 'sec-1',
            title: 'מוסתר',
            content: '',
            subSections: [{ id: 'sub-1', title: 'תת', content: '' }],
          },
          {
            id: 'sec-2',
            title: 'מסונן',
            content: '',
            subSections: [],
          },
        ],
      },
      firstSectionNumber: 1,
    },
  ];

  const nodes = flattenDocumentNodes(subjects, new Set(['sec-2']), (id) => id === 'sec-1');

  expect(nodes).toHaveLength(2);
  expect(nodes[0].type).toBe('subject');
  expect(nodes[1]).toEqual({
    type: 'section',
    id: 'sec-1',
    subjectId: 'subj-1',
    section: subjects[0].subject.sections[0],
    number: 1,
    hasSubSections: false,
  });
});
