import type { MouseEvent } from 'react';
import { GridTableRow } from '@/components/ui/GridTable';
import { SubTable, SubTableRow } from '@/components/ui/SubTable';
import { gray } from '@/styles/theme';
import { SelectionCheckbox } from '../../../../components/SelectionCheckbox';
import type { DocItem, PersonMember } from '../../../../MailingListModal.constants';
import { DOC_GRID } from '../../../../MailingListModal.constants';
import { ColHeader } from '../../../../MailingListModal.shared.styles';
import { ColCenter, SubCell, SubNameCell } from '../../DocTab.styles';
import { DOC_TAB_IDS } from '../../DocTab.testids';
import {
  CheckboxCell,
  CountLabel,
  ExpandBtn,
  ExpandChevron,
  NameCell,
} from '../../../tabs.shared.styles';

interface DocRowProps {
  doc: DocItem;
  isSelected: boolean;
  isAdded: boolean;
  isExpanded: boolean;
  onRowClick: () => void;
  onCheckClick: (e: MouseEvent) => void;
  onToggleExpand: (e: MouseEvent) => void;
}

export const DocRow = ({
  doc,
  isSelected,
  isAdded,
  isExpanded,
  onRowClick,
  onCheckClick,
  onToggleExpand,
}: DocRowProps) => (
  <GridTableRow
    isSelected={isSelected}
    isAdded={isAdded}
    onClick={onRowClick}
    expansion={
      isExpanded ? (
        <SubTable
          columns={DOC_GRID}
          headers={[
            null,
            <ColHeader $align="right">שם מלא</ColHeader>,
            <ColHeader>תעודת זהות</ColHeader>,
            null,
            <ColHeader>ארגון</ColHeader>,
          ]}
          items={doc.distribution}
          getRowKey={(p: PersonMember, i: number) => p.idNumber || i}
          renderRow={(p: PersonMember) => (
            <SubTableRow>
              <span />
              <SubNameCell>{p.name}</SubNameCell>
              <SubCell $tabular>{p.idNumber}</SubCell>
              <span />
              <SubCell>{p.environment}</SubCell>
            </SubTableRow>
          )}
        />
      ) : null
    }
  >
    <CheckboxCell data-testid={DOC_TAB_IDS.rowCheckbox(doc.id)} onClick={onCheckClick}>
      <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
    </CheckboxCell>
    <NameCell>
      {doc.name}
      <CountLabel>({doc.distribution.length})</CountLabel>
    </NameCell>
    <ColCenter>{doc.cmdNum}</ColCenter>
    <ColCenter>{doc.update}</ColCenter>
    <ColCenter>{doc.docType}</ColCenter>
    <ColCenter>{doc.environment}</ColCenter>
    <ColCenter $color={gray[500]}>{doc.lastUpdate}</ColCenter>
    <ColCenter $color={gray[400]}>{doc.refNum}</ColCenter>
    <ExpandBtn type="button" data-testid={DOC_TAB_IDS.rowExpand(doc.id)} onClick={onToggleExpand}>
      <ExpandChevron size={14} color={gray[400]} $isExpanded={isExpanded} />
    </ExpandBtn>
  </GridTableRow>
);
