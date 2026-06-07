import { ChevronLeft, Folder, FileText, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RightSidebarProps {
  onSelectDepartment?: (dept: string) => void;
  selectedDepartment?: string | null;
}

const MY_DEPTS  = ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה'];
const MAIN_ORGS = ['משרד הבריאות', 'משרד הביטחון', 'משרד החינוך', 'משרד הפנים'];
const OTHER_ORGS = [
  { name: 'ארגון א׳', depts: ['מחלקת תפעול', 'מחלקת לוגיסטיקה', 'מחלקת הנדסה'] },
  { name: 'ארגון ב׳', depts: ['מחלקת מודיעין', 'מחלקת תקשוב'] },
];

export function RightSidebar({ onSelectDepartment, selectedDepartment }: RightSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeSection,   setActiveSection]   = useState<string | null>(null);
  const [activeSubItem,   setActiveSubItem]   = useState<string | null>(null);
  const [expandedOrg,     setExpandedOrg]     = useState<string | null>(null);

  // Sync from external selectedDepartment (e.g. navigating to Catalog with pre-selected dept)
  useEffect(() => {
    if (!selectedDepartment) return;
    if (MY_DEPTS.includes(selectedDepartment)) {
      setActiveSection('myEnvironment');
      setExpandedSection('myEnvironment');
    } else if (MAIN_ORGS.includes(selectedDepartment)) {
      setActiveSection('mainDocuments');
      setExpandedSection('mainDocuments');
    } else if (OTHER_ORGS.some(o => o.depts.includes(selectedDepartment) || o.name === selectedDepartment)) {
      setActiveSection('additionalEnvironments');
      setExpandedSection('additionalEnvironments');
      const org = OTHER_ORGS.find(o => o.depts.includes(selectedDepartment));
      if (org) setExpandedOrg(org.name);
    } else if (selectedDepartment === 'כל המסמכים') {
      setActiveSection('allDocuments');
    }
    setActiveSubItem(selectedDepartment);
  }, [selectedDepartment]);

  const toggleSection = (key: string) => {
    setExpandedSection(prev => prev === key ? null : key);
  };

  const clickSection = (key: string) => {
    setActiveSection(key);
    setActiveSubItem(null);
    toggleSection(key);
    if (key === 'allDocuments') onSelectDepartment?.('כל המסמכים');
  };

  const clickSubItem = (parentSection: string, item: string) => {
    setActiveSection(parentSection);
    setExpandedSection(parentSection);
    setActiveSubItem(item);
    onSelectDepartment?.(item);
  };

  // Section button styling — blue when active
  const sectionClass = (key: string) =>
    `w-full flex items-center gap-3 px-4 py-1.5 rounded-full transition-all ${
      activeSection === key
        ? 'bg-[#1B3A6B] text-white'
        : 'hover:bg-white/60 text-gray-700'
    }`;

  const chevronClass = (key: string, expanded?: boolean) =>
    `w-4 h-4 flex-shrink-0 transition-transform ${expanded ? '-rotate-90' : ''} ${
      activeSection === key ? 'text-white' : 'text-gray-400'
    }`;

  const sectionLabel = (key: string) =>
    activeSection === key ? 'text-white' : 'text-gray-700';

  // Sub-item styling — white pill when active, otherwise normal
  const subItemClass = (item: string) =>
    `flex items-center gap-2 px-4 py-2 text-sm rounded-full cursor-pointer text-right transition-all ${
      activeSubItem === item
        ? 'bg-white text-[#1B3A6B] font-semibold shadow-sm'
        : 'text-gray-600 hover:bg-white/60'
    }`;

  const folderIconClass = (item: string) =>
    `w-3.5 h-3.5 flex-shrink-0 ${activeSubItem === item ? 'text-[#1B3A6B]' : 'text-gray-400'}`;

  return (
    <aside
      className="w-64 flex-shrink-0 overflow-y-auto z-10 relative px-4 py-6 before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[1px] before:bg-[#E5E5E5]"
      dir="rtl"
    >
      <div className="space-y-1">

        {/* הסביבה שלי */}
        <div>
          <button onClick={() => clickSection('myEnvironment')} className={sectionClass('myEnvironment')}>
            <ChevronLeft className={chevronClass('myEnvironment', expandedSection === 'myEnvironment')} />
            <span className={`text-right flex-1 ${sectionLabel('myEnvironment')}`}>הסביבה שלי</span>
          </button>
          {expandedSection === 'myEnvironment' && (
            <div className="mr-4 mt-1 space-y-0.5 px-2">
              {MY_DEPTS.map(dept => (
                <div key={dept} onClick={() => clickSubItem('myEnvironment', dept)} className={subItemClass(dept)}>
                  <Folder className={folderIconClass(dept)} />
                  <span className="flex-1">{dept}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* סביבות נוספות */}
        <div>
          <button onClick={() => clickSection('additionalEnvironments')} className={sectionClass('additionalEnvironments')}>
            <ChevronLeft className={chevronClass('additionalEnvironments', expandedSection === 'additionalEnvironments')} />
            <span className={`text-right flex-1 ${sectionLabel('additionalEnvironments')}`}>סביבות נוספות</span>
          </button>
          {expandedSection === 'additionalEnvironments' && (
            <div className="mr-4 mt-1 space-y-0.5 px-2">
              {OTHER_ORGS.map(org => (
                <div key={org.name}>
                  {/* Org row — expandable */}
                  <div
                    onClick={() => setExpandedOrg(prev => prev === org.name ? null : org.name)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full cursor-pointer text-right transition-all ${
                      expandedOrg === org.name ? 'text-gray-700 font-medium' : 'text-gray-600 hover:bg-white/60'
                    }`}
                  >
                    <ChevronLeft className={`w-3 h-3 flex-shrink-0 text-gray-400 transition-transform ${expandedOrg === org.name ? '-rotate-90' : ''}`} />
                    <Folder className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                    <span className="flex-1">{org.name}</span>
                  </div>
                  {/* Dept sub-items */}
                  {expandedOrg === org.name && (
                    <div className="mr-4 space-y-0.5">
                      {org.depts.map(dept => (
                        <div key={dept} onClick={() => clickSubItem('additionalEnvironments', dept)} className={subItemClass(dept)}>
                          <Folder className={folderIconClass(dept)} />
                          <span className="flex-1">{dept}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* כל המסמכים */}
        <button onClick={() => clickSection('allDocuments')} className={sectionClass('allDocuments')}>
          <ChevronLeft className={chevronClass('allDocuments')} />
          <span className={`text-right flex-1 ${sectionLabel('allDocuments')}`}>כל המסמכים</span>
        </button>

        {/* מסמכים ראשיים */}
        <div>
          <button onClick={() => clickSection('mainDocuments')} className={sectionClass('mainDocuments')}>
            <ChevronLeft className={chevronClass('mainDocuments', expandedSection === 'mainDocuments')} />
            <span className={`text-right flex-1 ${sectionLabel('mainDocuments')}`}>מסמכים ראשיים</span>
          </button>
          {expandedSection === 'mainDocuments' && (
            <div className="mr-4 mt-1 space-y-0.5 px-2">
              {MAIN_ORGS.map(org => (
                <div key={org} onClick={() => clickSubItem('mainDocuments', org)} className={subItemClass(org)}>
                  <Folder className={folderIconClass(org)} />
                  <span className="text-right flex-1">{org}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* מורה נבוכים */}
        <div>
          <button onClick={() => clickSection('guide')} className={sectionClass('guide')}>
            <ChevronLeft className={chevronClass('guide', expandedSection === 'guide')} />
            <span className={`text-right flex-1 ${sectionLabel('guide')}`}>מורה נבוכים</span>
          </button>
          {expandedSection === 'guide' && (
            <div className="mr-4 mt-1 space-y-0.5 px-2">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-full cursor-pointer transition-all">
                <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-right flex-1">מדיניות</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-full cursor-pointer transition-all">
                <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-right flex-1">שיתופי פעולה</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
