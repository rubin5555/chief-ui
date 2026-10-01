import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import { Field, ReadOnlyLabel, ReadOnlyValue } from '../components.shared.styles';
import { FactsGrid } from './DocFactsGrid.styles';

export interface DocFactsGridProps {
  classification: string;
  template: string;
  organization: string;
  orderNum: string;
  updateNum: string;
}

export const DocFactsGrid = ({
  classification,
  template,
  organization,
  orderNum,
  updateNum,
}: DocFactsGridProps) => {
  const facts = [
    { key: 'classification', label: 'סיווג', value: classification },
    { key: 'template', label: 'תבנית', value: template },
    { key: 'organization', label: 'ארגון', value: organization },
    { key: 'orderNum', label: 'מס׳ פקודה', value: orderNum },
    { key: 'updateNum', label: 'מס׳ עדכון', value: updateNum },
  ];

  return (
    <FactsGrid data-testid={EDIT_DOC_DETAILS_MODAL_IDS.factsGrid}>
      {facts.map((fact) => (
        <Field key={fact.key}>
          <ReadOnlyLabel>{fact.label}</ReadOnlyLabel>
          <ReadOnlyValue data-testid={EDIT_DOC_DETAILS_MODAL_IDS.fact(fact.key)}>
            {fact.value}
          </ReadOnlyValue>
        </Field>
      ))}
    </FactsGrid>
  );
};
