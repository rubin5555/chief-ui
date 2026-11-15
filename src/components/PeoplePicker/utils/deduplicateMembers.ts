import type { Member, PersonMember } from '../PeoplePicker.constants';

export const deduplicateMembers = (people: PersonMember[], idPrefix: string): Member[] => {
  const seenIds = new Set<string>();
  const result: Member[] = [];

  people.forEach((p, i) => {
    if (p.idNumber) {
      if (seenIds.has(p.idNumber)) return;
      seenIds.add(p.idNumber);
    }

    result.push({
      id: p.idNumber ? `${idPrefix}-${p.idNumber}` : `${idPrefix}-noid-${i}`,
      name: p.name,
      idNumber: p.idNumber,
      environment: p.environment,
    });
  });

  return result;
};
