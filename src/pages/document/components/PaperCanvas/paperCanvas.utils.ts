import type { SectionStatus, Subject } from '../../types';

/**
 * The ids of every node whose title or content contains `query`.
 *
 * Case-insensitive and trimmed, matching main (Edit.tsx:4215). An empty query
 * matches nothing rather than everything — an outline where every row is
 * highlighted says exactly as much as one where none is.
 *
 * main's own version of this is unreachable: `docSearchQuery` is declared and
 * never set (3205), so the amber outline it styles has never appeared. The
 * markup is main's; the query reaching it comes from the navbar's search field
 * through the URL.
 */
export const collectSearchMatchIds = (subjects: Subject[], query: string): Set<string> => {
  const needle = query.trim().toLowerCase();
  if (!needle) return new Set();

  const matched = new Set<string>();
  const match = (id: string, ...text: (string | undefined)[]) => {
    if (text.some((value) => value?.toLowerCase().includes(needle))) matched.add(id);
  };

  for (const subject of subjects) {
    match(subject.id, subject.title);
    for (const section of subject.sections) {
      match(section.id, section.title, section.content);
      for (const subSection of section.subSections) {
        match(subSection.id, subSection.title, subSection.content);
      }
    }
  }

  return matched;
};

/**
 * Pair each subject with the document-wide number its first section carries.
 *
 * main numbers sections continuously across topics (`secCounter`, Edit.tsx:4390)
 * — the third section of the first topic and the first section of the second
 * topic read `3.` and `4.`, not `1.3` and `2.1`. A subject can't derive that from
 * its own position, so it is computed once here.
 */
export const numberSubjects = (subjects: Subject[]) => {
  let nextNumber = 1;
  return subjects.map((subject) => {
    const firstSectionNumber = nextNumber;
    nextNumber += subject.sections.length;
    return { subject, firstSectionNumber };
  });
};

/**
 * The ids of every section and sub-section the active status filter excludes.
 *
 * Returned as the complement — what to hide — so the blocks stay a plain walk of
 * the real tree and keep their real positions; numbering a filtered list would
 * renumber whatever survived.
 *
 * `getStatus` is the overrides hook's own lookup, not a raw meta map, so a node
 * with no seeded meta entry gets the same default status here as it does
 * everywhere else and can't be quietly exempt from filtering.
 *
 * Note main's own status filter is inert: it renders chips and never touches the
 * document (Edit.tsx only reads `activeFilters` at 4108/4111). dev filters for
 * real — the one place the migrated page deliberately does more than the mock
 * rather than less, and it has an e2e test asserting it.
 */
export const collectFilteredNodeIds = (
  subjects: Subject[],
  getStatus: (id: string) => SectionStatus,
  statuses: string,
): Set<string> => {
  const active = statuses ? statuses.split(',') : [];
  if (active.length === 0) return new Set();

  const excluded = new Set<string>();
  const exclude = (id: string) => {
    if (!active.includes(getStatus(id))) excluded.add(id);
  };

  for (const subject of subjects) {
    for (const section of subject.sections) {
      exclude(section.id);
      for (const subSection of section.subSections) exclude(subSection.id);
    }
  }

  return excluded;
};
