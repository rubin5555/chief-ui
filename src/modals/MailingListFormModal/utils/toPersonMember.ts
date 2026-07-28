import type { NetworkPerson, PersonMember } from '../MailingListFormModal.constants';

export const toPersonMember = (person: NetworkPerson): PersonMember => ({
  name: person.name,
  idNumber: person.idNumber,
  environment: person.environment,
});
