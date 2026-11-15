import type { SectionStatus, Subject } from '../../types';

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
