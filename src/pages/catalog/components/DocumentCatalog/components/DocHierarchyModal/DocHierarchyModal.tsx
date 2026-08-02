import { FileText, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { CatalogDoc } from '@/api/catalog';
import { ALL_CATALOG_DOCS } from '@/api/catalog';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import { HierarchyDocSearch } from './components/HierarchyDocSearch';
import {
  Body,
  CompanionList,
  CompanionRow,
  DocCard,
  DocIcon,
  DocName,
  DocOrderNum,
  DocText,
  EmptyHint,
  ModeButton,
  ModeToggle,
  RemoveBtn,
  RoleBadge,
  Section,
  SectionTitle,
} from './DocHierarchyModal.styles';

interface DocHierarchyModalProps {
  doc: CatalogDoc;
  onClose: () => void;
}

// Which end of the relationship the current document sits at: `main` collects
// documents to hang beneath it, `companion` picks the one it hangs beneath.
type HierarchyMode = 'main' | 'companion';

const MODES: { id: HierarchyMode; label: string }[] = [
  { id: 'main', label: 'ראשי' },
  { id: 'companion', label: 'נלווה' },
];

export const DocHierarchyModal = ({ doc, onClose }: DocHierarchyModalProps) => {
  const [mode, setMode] = useState<HierarchyMode>('main');
  const [companions, setCompanions] = useState<CatalogDoc[]>([]);
  const [mainDoc, setMainDoc] = useState<CatalogDoc | null>(null);
  const modalRef = useRef<ModalHandle>(null);

  const requestClose = () => modalRef.current?.requestClose();

  // A document can neither be its own parent nor its own child, and a companion
  // already added should not be offered again.
  const pool = ALL_CATALOG_DOCS.filter(
    (candidate) =>
      candidate.id !== doc.id &&
      (mode === 'companion' || !companions.some((added) => added.id === candidate.id)),
  );

  // Switching ends discards what was gathered for the other one — the two
  // selections describe different relationships and don't carry over.
  const handleModeChange = (next: HierarchyMode) => () => {
    setMode(next);
    setCompanions([]);
    setMainDoc(null);
  };

  const onAddCompanion = (added: CatalogDoc) => setCompanions((prev) => [...prev, added]);

  const handleRemoveCompanion = (id: string) => () =>
    setCompanions((prev) => prev.filter((companion) => companion.id !== id));

  const onPickMain = (picked: CatalogDoc) => setMainDoc(picked);
  const onClearMain = () => setMainDoc(null);

  const canSave = mode === 'main' || Boolean(mainDoc);

  return (
    <Modal
      ref={modalRef}
      title="יצירת היררכית מסמכים"
      width={600}
      maxHeight="88vh"
      onClose={onClose}
      data-testid={CATALOG_MODAL_IDS.hierarchy}
      footerAlign="between"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={requestClose}>
            ביטול
          </Button>
          <Button type="button" disabled={!canSave} onClick={requestClose}>
            שמור
          </Button>
        </>
      }
    >
      <Body>
        <DocCard>
          <DocIcon>
            <FileText size={20} />
          </DocIcon>
          <DocText>
            <DocName $strong>{doc.name}</DocName>
            <DocOrderNum>{doc.orderNum}</DocOrderNum>
          </DocText>
          <ModeToggle>
            {MODES.map(({ id, label }) => (
              <ModeButton
                key={id}
                type="button"
                $active={mode === id}
                $divided={id === 'companion'}
                data-testid={CATALOG_MODAL_IDS.hierarchyMode(id)}
                onClick={handleModeChange(id)}
              >
                {label}
              </ModeButton>
            ))}
          </ModeToggle>
        </DocCard>

        {mode === 'main' ? (
          <Section>
            <SectionTitle>מסמכים נלווים</SectionTitle>
            <HierarchyDocSearch
              pool={pool}
              placeholder="חיפוש לפי שם מסמך או מס׳ פקודה..."
              onSelect={onAddCompanion}
            />
            {companions.length > 0 ? (
              <CompanionList>
                {companions.map((companion) => (
                  <CompanionRow
                    key={companion.id}
                    data-testid={CATALOG_MODAL_IDS.hierarchyCompanion(companion.id)}
                  >
                    <DocIcon $muted>
                      <FileText size={16} />
                    </DocIcon>
                    <DocText>
                      <DocName>{companion.name}</DocName>
                      <DocOrderNum>{companion.orderNum}</DocOrderNum>
                    </DocText>
                    <RemoveBtn
                      type="button"
                      aria-label={`הסרת ${companion.name}`}
                      onClick={handleRemoveCompanion(companion.id)}
                    >
                      <X size={14} />
                    </RemoveBtn>
                  </CompanionRow>
                ))}
              </CompanionList>
            ) : (
              <EmptyHint>חפש וסמן מסמכים נלווים שיצורפו להיררכיה</EmptyHint>
            )}
          </Section>
        ) : (
          <Section>
            <SectionTitle>מסמך ראשי לחיבור</SectionTitle>
            {mainDoc ? (
              <DocCard>
                <DocIcon>
                  <FileText size={20} />
                </DocIcon>
                <DocText>
                  <DocName $strong>{mainDoc.name}</DocName>
                  <DocOrderNum>{mainDoc.orderNum}</DocOrderNum>
                </DocText>
                <RoleBadge>ראשי</RoleBadge>
                <RemoveBtn type="button" aria-label="ניקוי הבחירה" onClick={onClearMain}>
                  <X size={14} />
                </RemoveBtn>
              </DocCard>
            ) : (
              <>
                <HierarchyDocSearch
                  pool={pool}
                  placeholder="חיפוש מסמך ראשי לפי שם או מס׳ פקודה..."
                  onSelect={onPickMain}
                />
                <EmptyHint>חפש ובחר את המסמך הראשי שאליו יחובר המסמך הנוכחי</EmptyHint>
              </>
            )}
          </Section>
        )}
      </Body>
    </Modal>
  );
};
