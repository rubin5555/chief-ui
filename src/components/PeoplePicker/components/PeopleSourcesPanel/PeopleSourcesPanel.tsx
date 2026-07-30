import type { ReactNode } from 'react';
import { type ChangeEvent, useState } from 'react';
import { IconTab } from '@/components/ui/IconTab';
import { SearchSlotProvider } from '@/context/SearchSlotContext';
import { useImportSource } from '../../hooks/useImportSource';
import type { ImportTabId, Member } from '../../PeoplePicker.constants';
import { IMPORT_TABS } from '../../PeoplePicker.constants';
import { PlaceholderText, SearchRow, TabBar, TabContent } from '../../PeoplePicker.styles';
import { PEOPLE_PICKER_IDS } from '../../PeoplePicker.testids';
import { DocTab } from '../../tabs/DocTab';
import { ExcelTab } from '../../tabs/ExcelTab';
import { HamalTab } from '../../tabs/HamalTab';
import { MirageTab } from '../../tabs/MirageTab';
import { NetworkTab } from '../../tabs/NetworkTab';
import { PersonalTab } from '../../tabs/PersonalTab';
import { ModalSearchInput } from '../ModalSearchInput';
import { SourcesRoot } from './PeopleSourcesPanel.styles';

const byIdNumber = (m: Member) => m.idNumber;
const byId = (m: Member) => m.id;

interface PeopleSourcesPanelProps {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
  header?: ReactNode;
  width?: number;
  onTabChange?: (id: ImportTabId) => void;
}

export const PeopleSourcesPanel = ({
  members,
  onMembersChange,
  header,
  width,
  onTabChange,
}: PeopleSourcesPanelProps) => {
  const [searchSlotNode, setSearchSlotNode] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<ImportTabId | null>(null);
  const [networkInitialQuery, setNetworkInitialQuery] = useState('');
  const [autoFocusNetworkSearch, setAutoFocusNetworkSearch] = useState(false);

  const [preSearchQuery, setPreSearchQuery] = useState('');

  const addedMemberIds = new Set(members.map((m) => m.id));
  const activeTabHasSearch = IMPORT_TABS.find((tab) => tab.id === activeTab)?.hasSearch !== false;

  const addMembers = (newMembers: Member[], dedupeKey: (member: Member) => string | undefined) => {
    const existingKeys = new Set(members.map(dedupeKey));
    onMembersChange([...members, ...newMembers.filter((m) => !existingKeys.has(dedupeKey(m)))]);
  };

  const { addedIds: docAdded, onImport: onDocImport } = useImportSource(byIdNumber, addMembers);
  const { addedIds: hamalAdded, onImport: onHamalImport } = useImportSource(byId, addMembers);
  const { addedIds: mirageAdded, onImport: onMirageImport } = useImportSource(byId, addMembers);
  const { addedIds: personalAdded, onImport: onPersonalImport } = useImportSource(
    byIdNumber,
    addMembers,
  );
  const { addedIds: excelAdded, onImport: onExcelImport } = useImportSource(byIdNumber, addMembers);

  const onAddMember = (member: Member) => {
    if (members.some((m) => m.id === member.id || (m.idNumber && m.idNumber === member.idNumber)))
      return;
    onMembersChange([...members, member]);
  };

  const selectTab = (id: ImportTabId) => {
    setActiveTab(id);
    onTabChange?.(id);
  };

  const onTabSelect = (id: ImportTabId) => () => selectTab(id);

  const onActivateNetworkFromSearch = (query: string) => {
    if (activeTab !== null) return;
    setNetworkInitialQuery(query);
    setAutoFocusNetworkSearch(true);
    selectTab('network');
  };

  const onPreSearchFocus = () => onActivateNetworkFromSearch(preSearchQuery);

  const onPreSearchQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreSearchQuery(e.target.value);
    onActivateNetworkFromSearch(e.target.value);
  };

  const tabContent: Record<ImportTabId, ReactNode> = {
    network: (
      <NetworkTab
        addedMemberIds={addedMemberIds}
        onAdd={onAddMember}
        initialQuery={networkInitialQuery}
        autoFocus={autoFocusNetworkSearch}
      />
    ),
    doc: <DocTab addedDocIds={docAdded} onImport={onDocImport} />,
    hamal: <HamalTab addedGroupIds={hamalAdded} onImport={onHamalImport} />,
    mirage: <MirageTab addedGroupIds={mirageAdded} onImport={onMirageImport} />,
    personal: <PersonalTab addedListIds={personalAdded} onImport={onPersonalImport} />,
    excel: <ExcelTab addedIdNumbers={excelAdded} onImport={onExcelImport} />,
  };

  return (
    <SourcesRoot $width={width} data-testid={PEOPLE_PICKER_IDS.sourcesPanel}>
      <SearchSlotProvider value={searchSlotNode}>
        {header}

        <TabBar data-testid={PEOPLE_PICKER_IDS.tabBar}>
          {IMPORT_TABS.map(({ id, label, Icon, compact, idleIconColor }) => (
            <IconTab
              key={id}
              icon={Icon}
              label={label}
              isActive={activeTab === id}
              compact={compact}
              idleIconColor={idleIconColor}
              onClick={onTabSelect(id)}
            />
          ))}
        </TabBar>

        <SearchRow
          ref={setSearchSlotNode}
          $hidden={!activeTabHasSearch}
          data-testid={PEOPLE_PICKER_IDS.searchBar}
        >
          {activeTab === null && (
            <ModalSearchInput
              value={preSearchQuery}
              onChange={onPreSearchQueryChange}
              onFocus={onPreSearchFocus}
              placeholder="בחר מקור ייבוא או חפש לפי שם"
            />
          )}
        </SearchRow>

        <TabContent data-testid={PEOPLE_PICKER_IDS.tabContent}>
          {activeTab !== null ? (
            tabContent[activeTab]
          ) : (
            <PlaceholderText>בחר מקור ייבוא או חפש לפי שם</PlaceholderText>
          )}
        </TabContent>
      </SearchSlotProvider>
    </SourcesRoot>
  );
};
