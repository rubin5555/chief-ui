import { Field, ReadOnlyLabel, ReadOnlyValue } from '../../EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import { FactsGrid } from './DocFactsGrid.styles';

export interface DocFactsGridProps {
  classification: string;
  template: string;
  organization: string;
  orderNum: string;
  updateNum: string;
}

/**
 * What the document already is, settled when it was created: its classification,
 * the template it came from, whose it is, and which order and revision it
 * carries. main puts these above the editable fields as plain boxes and never
 * writes any of them (Edit.tsx:2259).
 *
 * The classification and the organisation used to be editable selects here. They
 * are facts in main and they are facts now — a document that changes hands or
 * changes classification is a different document, not an edit to this one.
 */
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
