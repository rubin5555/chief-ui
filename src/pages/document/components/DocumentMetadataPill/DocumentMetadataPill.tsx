import type { DocumentHeader } from '../../types';
import { Cell, DocName, Fact, OrgName, PillBar, Separator } from './DocumentMetadataPill.styles';
import { DOCUMENT_METADATA_PILL_IDS } from './DocumentMetadataPill.testids';

export interface DocumentMetadataPillProps {
  header: DocumentHeader;
}

// main's document metadata bar (Edit.tsx:3688-3708): a flat grey pill of
// pipe-separated facts sitting above the paper, 1cm wider than A4 on each side.
//
// It is deliberately inert — no edit button. main hardcodes every value here
// except name/orderNum; this reads them all off `header` instead, which holds
// exactly those literals (src/api/docs.ts's DOCUMENT_FALLBACK.header), so the
// rendered output matches while the modal that edits them can't drift out of
// sync with what's displayed. Some facts carry a Hebrew prefix, so they're
// composed here rather than being a bare `header[key]` lookup.
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
