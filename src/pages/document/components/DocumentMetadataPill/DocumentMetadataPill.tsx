import type { DocumentHeader } from '../../types';
import { Cell, DocName, Fact, OrgName, PillBar, Separator } from './DocumentMetadataPill.styles';
import { DOCUMENT_METADATA_PILL_IDS } from './DocumentMetadataPill.testids';

export interface DocumentMetadataPillProps {
  header: DocumentHeader;
}

export const DocumentMetadataPill = ({ header }: DocumentMetadataPillProps) => {
  const facts: { key: string; text: string }[] = [
    { key: 'template', text: header.template },
    { key: 'orderNum', text: `מס׳ ${header.orderNum}` },
    { key: 'department', text: header.department },
    { key: 'effectiveDate', text: `כניסה לתוקף ${header.effectiveDate}` },
    { key: 'classification', text: header.classification },
    { key: 'referenceNum', text: `סימוכין ${header.referenceNum}` },
  ];

  return (
    <PillBar data-testid={DOCUMENT_METADATA_PILL_IDS.root}>
      <Cell>
        <DocName data-testid={DOCUMENT_METADATA_PILL_IDS.title}>
          {header.name} <OrgName>({header.organization})</OrgName>
        </DocName>
      </Cell>
      {facts.map((fact) => (
        <Cell key={fact.key}>
          <Separator aria-hidden="true">|</Separator>
          <Fact data-testid={DOCUMENT_METADATA_PILL_IDS.fact(fact.key)}>{fact.text}</Fact>
        </Cell>
      ))}
    </PillBar>
  );
};
