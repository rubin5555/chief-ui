import type { NetworkPerson, PersonMember } from '../PeoplePicker.constants';

export const toPersonMember = (person: NetworkPerson): PersonMember => ({
  name: person.name,
  idNumber: person.idNumber,
  environment: person.environment,
});
