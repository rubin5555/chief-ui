import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { IconTab } from '@/components/ui/IconTab';
import { Select } from '@/components/ui/Select';
import { SearchSlotProvider } from '@/context/SearchSlotContext';
import type { ImportTabId } from '../../MailingListModal.constants';
import { AGAF_OPTIONS, IMPORT_TABS } from '../../MailingListModal.constants';
import {
  FieldInput,
  FieldLabel,
  FormSection,
  PlaceholderText,
  RightPanel,
  SearchRow,
  TabBar,
  TabContent,
  WarnText,
} from '../../MailingListModal.styles';
import { NEW_LIST_IDS } from '../../MailingListModal.testids';
import { ModalSearchInput } from '../ModalSearchInput';

interface ImportPanelProps {
  formId: string;
  onFormSubmit: (e: FormEvent) => void;
  listName: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDupBlocked: boolean;
  activeTab: ImportTabId | null;
  onTabSelect: (id: ImportTabId) => () => void;
  onActivateNetworkFromSearch: (query: string) => void;
  tabContent: Record<ImportTabId, ReactNode>;
}

export const ImportPanel = ({
  formId,
  onFormSubmit,
  listName,
  onNameChange,
  isDupBlocked,
  activeTab,
  onTabSelect,
  onActivateNetworkFromSearch,
  tabContent,
}: ImportPanelProps) => {
  const [searchSlotNode, setSearchSlotNode] = useState<HTMLDivElement | null>(null);
  // Local to this box: it unmounts the instant activeTab flips away from null (see
  // SearchRow below), so there is nothing to keep in sync with the parent past that point.
  const [preSearchQuery, setPreSearchQuery] = useState('');

  const onPreSearchFocus = () => onActivateNetworkFromSearch(preSearchQuery);

  const onPreSearchQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreSearchQuery(e.target.value);
    onActivateNetworkFromSearch(e.target.value);
  };

  return (
    <RightPanel>
      <SearchSlotProvider value={searchSlotNode}>
        <FormSection id={formId} onSubmit={onFormSubmit}>
          <div>
            <FieldLabel htmlFor="list-name">שם רשימת התפוצה</FieldLabel>
            <FieldInput
              id="list-name"
              data-testid={NEW_LIST_IDS.nameInput}
              type="text"
              value={listName}
              onChange={onNameChange}
              placeholder="הזן שם רשימה..."
              $warn={isDupBlocked}
            />
            {isDupBlocked && <WarnText>יש לשנות את שם הרשימה לפני השכפול</WarnText>}
          </div>
          <div>
            <FieldLabel htmlFor="list-agaf">בחירת אגף</FieldLabel>
            <Select
              id="list-agaf"
              data-testid={NEW_LIST_IDS.agafSelect}
              options={AGAF_OPTIONS}
              placeholder="בחר אגף..."
            />
          </div>
        </FormSection>

        <TabBar data-testid={NEW_LIST_IDS.tabBar}>
          {IMPORT_TABS.map(({ id, label, Icon }) => (
            <IconTab
              key={id}
              icon={Icon}
              label={label}
              isActive={activeTab === id}
              onClick={onTabSelect(id)}
            />
          ))}
        </TabBar>

        <SearchRow ref={setSearchSlotNode} data-testid={NEW_LIST_IDS.searchBar}>
          {activeTab === null && (
            <ModalSearchInput
              value={preSearchQuery}
              onChange={onPreSearchQueryChange}
              onFocus={onPreSearchFocus}
              placeholder="בחר מקור ייבוא או חפש לפי שם"
            />
          )}
        </SearchRow>

        <TabContent data-testid={NEW_LIST_IDS.tabContent}>
          {activeTab !== null ? (
            tabContent[activeTab]
          ) : (
            <PlaceholderText>בחר מקור ייבוא או חפש לפי שם</PlaceholderText>
          )}
        </TabContent>
      </SearchSlotProvider>
    </RightPanel>
  );
};
