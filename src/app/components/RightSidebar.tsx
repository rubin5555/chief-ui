import { ChevronLeft, Folder, FileText, BookOpen, ArrowRight, FolderPlus, Pencil, FolderOpen, Trash2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface RightSidebarProps {
  onSelectDepartment?: (dept: string) => void;
  selectedDepartment?: string | null;
  onSelectFolder?: (dept: string, folder: string | null, sub?: string | null) => void;
  onOpenCommandPage?: (org: string) => void;
}

interface FolderNode {
  id: string;
  name: string;
  subs: string[];
  subCollapsed: boolean;
  docs?: number;
}

const MY_ENV_NAME = 'הסביבה שלי';
const MY_DEPTS    = ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה'];
const MAIN_ORGS   = ['משרד הבריאות', 'משרד הביטחון', 'משרד החינוך', 'משרד הפנים'];
const OTHER_ORGS  = [
  { name: 'ארגון א׳', depts: ['מחלקת תפעול', 'מחלקת לוגיסטיקה', 'מחלקת הנדסה'] },
  { name: 'ארגון ב׳', depts: ['מחלקת מודיעין', 'מחלקת תקשוב'] },
  { name: 'ארגון ג׳', depts: ['מחלקת מחקר', 'מחלקת פיתוח'] },
  { name: 'ארגון ד׳', depts: ['מחלקת שיווק', 'מחלקת מכירות', 'מחלקת תמיכה'] },
];

let _uid = 1;
const uid = () => String(_uid++);

const SEED_FOLDERS: Record<string, FolderNode[]> = {
  'מחלקת משאבי אנוש': [
    { id: uid(), name: 'מבצע קיץ 2024', subs: ['שלב א׳', 'שלב ב׳'], subCollapsed: false, docs: 3 },
    { id: uid(), name: 'נהלי בטיחות',    subs: [], subCollapsed: false, docs: 5 },
    { id: uid(), name: 'גיוס עובדים',    subs: [], subCollapsed: false, docs: 2 },
    { id: uid(), name: 'הדרכות שנתיות', subs: [], subCollapsed: false, docs: 4 },
    { id: uid(), name: 'נהלי שכר',       subs: [], subCollapsed: false, docs: 6 },
    { id: uid(), name: 'הסכמי העסקה',   subs: [], subCollapsed: false, docs: 1 },
    { id: uid(), name: 'ביקורות פנימיות', subs: [], subCollapsed: false, docs: 3 },
    { id: uid(), name: 'מבצע חורף 2024', subs: [], subCollapsed: false, docs: 2 },
    { id: uid(), name: 'פרוטוקולי ועדה', subs: [], subCollapsed: false, docs: 7 },
    { id: uid(), name: 'תכניות עבודה',   subs: [], subCollapsed: false, docs: 4 },
  ],
  'מחלקת כספים': [
    { id: uid(), name: 'תקציב שנתי',       subs: [], subCollapsed: false, docs: 8 },
    { id: uid(), name: 'דיווחים רבעוניים', subs: [], subCollapsed: false, docs: 4 },
    { id: uid(), name: 'ביקורת חשבונות',  subs: [], subCollapsed: false, docs: 3 },
    { id: uid(), name: 'הוצאות שוטפות',   subs: [], subCollapsed: false, docs: 2 },
    { id: uid(), name: 'רכש וספקים',      subs: [], subCollapsed: false, docs: 5 },
    { id: uid(), name: 'השקעות',           subs: [], subCollapsed: false, docs: 1 },
    { id: uid(), name: 'דוחות שנתיים',    subs: [], subCollapsed: false, docs: 6 },
    { id: uid(), name: 'תחזיות תקציב',    subs: [], subCollapsed: false, docs: 3 },
  ],
  'מחלקת טכנולוגיה': [
    { id: uid(), name: 'פרויקטים פעילים', subs: [], subCollapsed: false, docs: 5 },
    { id: uid(), name: 'תשתיות רשת',      subs: [], subCollapsed: false, docs: 3 },
    { id: uid(), name: 'אבטחת מידע',      subs: [], subCollapsed: false, docs: 4 },
  ],
  'כל המסמכים': [
    { id: uid(), name: 'הסביבה שלי', subs: ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה'], subCollapsed: true, docs: 15 },
    { id: uid(), name: 'ארגון א׳',   subs: ['מחלקת תפעול', 'מחלקת לוגיסטיקה', 'מחלקת הנדסה'],     subCollapsed: true, docs: 9  },
    { id: uid(), name: 'ארגון ב׳',   subs: ['מחלקת מודיעין', 'מחלקת תקשוב'],                       subCollapsed: true, docs: 6  },
    { id: uid(), name: 'ארגון ג׳',   subs: ['מחלקת מחקר', 'מחלקת פיתוח'],                          subCollapsed: true, docs: 7  },
    { id: uid(), name: 'ארגון ד׳',   subs: ['מחלקת שיווק', 'מחלקת מכירות', 'מחלקת תמיכה'],        subCollapsed: true, docs: 5  },
  ],
};

/* ── Delete confirmation modal ── */
function DeleteFolderModal({ onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl" style={{ width: 360 }}>
        <div className="px-8 pt-8 pb-5 text-center">
          <p className="text-base font-bold text-gray-800">האם אתה בטוח שברצונך למחוק?</p>
          <p className="text-sm text-gray-400 mt-2">פעולה זו אינה ניתנת לביטול.</p>
        </div>
        <div className="flex items-center gap-3 px-6 pb-6">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#1B3A6B' }}>
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Single folder card ── */
function FolderCard({ node, onRename, onDeleteRequest, onAddSub, onToggleSubs, isSelected, selectedSub, onSelect, onSelectSub, readOnly }: {
  node: FolderNode;
  onRename: (newName: string) => void;
  onDeleteRequest: () => void;
  onAddSub: (subName: string) => void;
  onToggleSubs: () => void;
  isSelected?: boolean;
  selectedSub?: string | null;
  onSelect?: () => void;
  onSelectSub?: (sub: string) => void;
  readOnly?: boolean;
}) {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [isRenaming,    setIsRenaming]    = useState(false);
  const [renameVal,     setRenameVal]     = useState(node.name);
  const [showSubInput,  setShowSubInput]  = useState(false);
  const [subName,       setSubName]       = useState('');
  const menuRef   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { setRenameVal(node.name); }, [node.name]);

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  const confirmRename = () => {
    const v = renameVal.trim();
    if (v && v !== node.name) onRename(v);
    else setRenameVal(node.name);
    setIsRenaming(false);
  };

  const confirmAddSub = () => {
    if (subName.trim()) { onAddSub(subName.trim()); setSubName(''); setShowSubInput(false); }
  };

  return (
    <div>
      {/* Folder card */}
      <div className="relative cursor-pointer select-none w-full group">
        {/* Body */}
        <div
          onClick={() => onSelect?.()}
          className={`flex items-center gap-2.5 px-2 rounded-full transition-colors cursor-pointer ${isSelected ? 'bg-[#1B3A6B]' : 'hover:bg-white/70'}`}
          style={{ height: 38 }}>
          {/* Folder icon — rightmost in RTL */}
          <Folder className="w-[15px] h-[15px] flex-shrink-0" style={{ color: isSelected ? 'white' : '#1B3A6B' }} />

          {/* Chevron toggle — always takes space to keep name aligned */}
          <button
            onClick={e => { e.stopPropagation(); if (node.subs.length > 0) onToggleSubs(); }}
            className={`flex-shrink-0 transition-colors ${isSelected ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-[#1B3A6B]'}`}
            style={{ visibility: node.subs.length > 0 ? 'visible' : 'hidden' }}>
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${node.subCollapsed ? '' : '-rotate-90'}`} />
          </button>

          {isRenaming ? (
            <input
              ref={inputRef}
              value={renameVal}
              onChange={e => setRenameVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') confirmRename();
                if (e.key === 'Escape') { setIsRenaming(false); setRenameVal(node.name); }
              }}
              onBlur={confirmRename}
              onClick={e => e.stopPropagation()}
              className="flex-1 text-sm font-bold outline-none bg-transparent border-b-2 border-[#1B3A6B] text-gray-800"
              dir="rtl"
            />
          ) : (
            <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
              <span className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>{node.name}</span>
              {node.docs != null && node.docs > 0 && (
                <span className={`text-[11px] flex-shrink-0 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>({node.docs})</span>
              )}
            </div>
          )}

          {/* ··· menu — visible only on hover, hidden when readOnly */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            {!readOnly && (
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
              className={`w-6 h-6 flex items-center justify-center rounded-full transition-all text-base leading-none pb-1 opacity-0 group-hover:opacity-100 ${isSelected ? 'text-white/70 hover:bg-white/20' : 'text-gray-400 hover:bg-gray-100'}`}>
              ···
            </button>
            )}
            {menuOpen && (
              <div className="absolute left-0 top-8 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44" dir="rtl">
                <button
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); setIsRenaming(true); setRenameVal(node.name); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  שינוי שם
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); setShowSubInput(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <FolderOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  יצירת תת תיקייה
                </button>
                <div className="mx-3 my-1 h-px bg-gray-100" />
                <button
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); onDeleteRequest(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                  מחיקת תיקייה
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-folder input */}
      {showSubInput && (
        <div className="mr-4 mt-2 flex flex-col gap-1.5">
          <input
            autoFocus
            value={subName}
            onChange={e => setSubName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') confirmAddSub();
              if (e.key === 'Escape') { setShowSubInput(false); setSubName(''); }
            }}
            placeholder="שם תת-התיקייה..."
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1B3A6B] text-right bg-white"
            dir="rtl"
          />
          <div className="flex gap-1.5">
            <button onClick={confirmAddSub}
              className="flex-1 py-1.5 text-[11px] font-semibold rounded-full text-white transition-colors"
              style={{ background: '#1B3A6B' }}>
              אישור
            </button>
            <button onClick={() => { setShowSubInput(false); setSubName(''); }}
              className="flex-1 py-1.5 text-[11px] font-medium rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* Sub-folders list */}
      {node.subs.length > 0 && !node.subCollapsed && (
        <div className="mr-3 mt-1 flex flex-col gap-1 border-r-2 pr-2" style={{ borderColor: '#D1D5DB' }}>
          {node.subs.map(sub => {
            const subActive = selectedSub === sub;
            return (
              <div key={sub}
                onClick={e => { e.stopPropagation(); onSelectSub?.(sub); }}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${subActive ? 'bg-white text-[#1B3A6B] shadow-sm' : 'text-gray-700 hover:bg-white/70'}`}>
                <Folder className="w-[13px] h-[13px] flex-shrink-0" style={{ color: '#1B3A6B' }} />
                <span className="truncate">{sub}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RightSidebar({ onSelectDepartment, selectedDepartment, onSelectFolder, onOpenCommandPage }: RightSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeSection,   setActiveSection]   = useState<string | null>(null);
  const [activeSubItem,   setActiveSubItem]   = useState<string | null>(null);
  const [expandedOrg,     setExpandedOrg]     = useState<string | null>(null);

  // Folder-view state
  const [folderDept,     setFolderDept]     = useState<string | null>(null);
  const [folderEnv,      setFolderEnv]      = useState<string | null>(null);
  const [folders,        setFolders]        = useState<Record<string, FolderNode[]>>(SEED_FOLDERS);
  const [showNewInput,   setShowNewInput]   = useState(false);
  const [newName,        setNewName]        = useState('');
  const [deleteTarget,   setDeleteTarget]   = useState<FolderNode | null>(null);
  const [selectedFolderId,  setSelectedFolderId]  = useState<string | null>(null);
  const [selectedFolderSub, setSelectedFolderSub] = useState<string | null>(null);
  const [guideCollapsed,    setGuideCollapsed]    = useState<Record<string, boolean>>({});

  const inFolderView = folderDept !== null;
  const isGuideFolderView = folderDept === 'מדיניות' || folderDept === 'הוראות';

  useEffect(() => {
    if (!selectedDepartment) return;
    if (MY_DEPTS.includes(selectedDepartment)) {
      setActiveSection('myEnvironment'); setExpandedSection('myEnvironment');
    } else if (MAIN_ORGS.includes(selectedDepartment)) {
      setActiveSection('mainDocuments'); setExpandedSection('mainDocuments');
    } else if (OTHER_ORGS.some(o => o.depts.includes(selectedDepartment) || o.name === selectedDepartment)) {
      setActiveSection('additionalEnvironments'); setExpandedSection('additionalEnvironments');
      const org = OTHER_ORGS.find(o => o.depts.includes(selectedDepartment));
      if (org) setExpandedOrg(org.name);
    } else if (selectedDepartment === 'כל המסמכים') {
      setActiveSection('allDocuments');
    } else if (selectedDepartment === 'מדיניות' || selectedDepartment === 'הוראות') {
      setActiveSection('guide'); setExpandedSection('guide');
      setFolderDept(selectedDepartment); setFolderEnv('מורה נבוכים');
    }
    setActiveSubItem(selectedDepartment);
  }, [selectedDepartment]);

  const toggleSection = (key: string) => setExpandedSection(prev => prev === key ? null : key);

  const clickSection = (key: string) => {
    setActiveSection(key); setActiveSubItem(null); toggleSection(key);
    if (key === 'allDocuments') {
      onSelectDepartment?.('כל המסמכים');
      setFolderDept('כל המסמכים'); setFolderEnv('כל המסמכים');
      setShowNewInput(false); setNewName('');
      setSelectedFolderId(null); setSelectedFolderSub(null);
    }
  };

  const clickSubItem = (parentSection: string, item: string, envName: string) => {
    setActiveSection(parentSection); setExpandedSection(parentSection);
    setActiveSubItem(item); onSelectDepartment?.(item);
    if (parentSection === 'myEnvironment' || parentSection === 'additionalEnvironments') {
      setFolderDept(item); setFolderEnv(envName);
      setShowNewInput(false); setNewName('');
    } else if (parentSection === 'guide') {
      setFolderDept(item); setFolderEnv('מורה נבוכים');
      setShowNewInput(false); setNewName('');
      setSelectedFolderId(null); setSelectedFolderSub(null);
    }
  };

  const exitFolderView = () => { setFolderDept(null); setFolderEnv(null); setShowNewInput(false); setNewName(''); };

  const createFolder = () => {
    const name = newName.trim();
    if (!name || !folderDept) return;
    setFolders(prev => ({ ...prev, [folderDept]: [...(prev[folderDept] ?? []), { id: uid(), name, subs: [], subCollapsed: false }] }));
    setNewName(''); setShowNewInput(false);
  };

  const updateNode = (dept: string, id: string, patch: Partial<FolderNode>) =>
    setFolders(prev => ({ ...prev, [dept]: prev[dept].map(f => f.id === id ? { ...f, ...patch } : f) }));

  const deleteNode = (dept: string, id: string) =>
    setFolders(prev => ({ ...prev, [dept]: prev[dept].filter(f => f.id !== id) }));

  /* ── Styling helpers ── */
  const sectionClass = (key: string) =>
    `w-full flex items-center gap-3 px-4 py-1.5 rounded-full transition-all ${
      activeSection === key ? 'bg-[#1B3A6B] text-white' : 'hover:bg-white/60 text-gray-700'
    }`;
  const chevronClass = (key: string, expanded?: boolean) =>
    `w-4 h-4 flex-shrink-0 transition-transform ${expanded ? '-rotate-90' : ''} ${activeSection === key ? 'text-white' : 'text-gray-400'}`;
  const sectionLabel = (key: string) => activeSection === key ? 'text-white' : 'text-gray-700';
  const subItemClass = (item: string) =>
    `flex items-center gap-2 px-4 py-2 text-sm rounded-full cursor-pointer text-right transition-all ${
      activeSubItem === item ? 'bg-white text-[#1B3A6B] font-semibold shadow-sm' : 'text-gray-600 hover:bg-white/60'
    }`;
  const folderIconClass = (item: string) =>
    `w-3.5 h-3.5 flex-shrink-0 ${activeSubItem === item ? 'text-[#1B3A6B]' : 'text-gray-400'}`;

  const deptFolders: FolderNode[] = isGuideFolderView
    ? MY_DEPTS.map(dept => ({
        id: dept,
        name: dept,
        subs: (folders[dept] ?? []).map(f => f.name),
        subCollapsed: guideCollapsed[dept] ?? false,
        docs: (folders[dept] ?? []).reduce((acc, f) => acc + (f.docs ?? 0), 0),
      }))
    : (folderDept ? (folders[folderDept] ?? []) : []);

  /* ══════════════════════════════════════
     FOLDER VIEW
  ══════════════════════════════════════ */
  if (inFolderView && folderDept) {
    return (
      <>
        <aside
          className="w-64 flex-shrink-0 z-10 relative before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[1px] before:bg-[#E5E5E5]"
          style={{ direction: 'ltr', overflow: 'hidden' }}>
          <div className="overflow-y-auto h-full flex flex-col gap-4 px-4 py-5 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{ direction: 'rtl' }}>
          <button onClick={() => { exitFolderView(); if (folderDept === 'כל המסמכים' || isGuideFolderView) onSelectFolder?.(folderDept!, null, null); setSelectedFolderId(null); setSelectedFolderSub(null); }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1B3A6B] transition-colors w-fit">
            <ArrowRight className="w-3.5 h-3.5" />
            חזור לתפריט
          </button>

          <div className="flex flex-col gap-0.5">
            {(folderDept !== 'כל המסמכים' && !isGuideFolderView) && <span className="text-[11px] text-gray-400">{folderEnv}</span>}
            <span className="text-sm font-semibold text-gray-800">{folderDept}</span>
          </div>

          <div className="h-px bg-gray-100" />

          {/* New folder button / input — hidden in read-only (all-docs / guide) mode */}
          {folderDept !== 'כל המסמכים' && !isGuideFolderView && (showNewInput ? (
            <div className="flex flex-col gap-2">
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') { setShowNewInput(false); setNewName(''); } }}
                placeholder="שם התיקייה..."
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#1B3A6B] text-right bg-white"
                dir="rtl" />
              <div className="flex gap-2">
                <button onClick={createFolder}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-full text-white transition-colors"
                  style={{ background: '#1B3A6B' }}>
                  צור
                </button>
                <button onClick={() => { setShowNewInput(false); setNewName(''); }}
                  className="flex-1 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNewInput(true)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-dashed border-gray-300 hover:border-[#1B3A6B] hover:bg-blue-50/50 text-gray-500 hover:text-[#1B3A6B] transition-all">
              <FolderPlus className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">תיקייה חדשה</span>
            </button>
          ))}

          {/* Folder list */}
          {deptFolders.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {deptFolders.map(node => (
                <FolderCard
                  key={node.id}
                  node={node}
                  readOnly={folderDept === 'כל המסמכים' || isGuideFolderView}
                  onRename={newName => updateNode(folderDept, node.id, { name: newName })}
                  onDeleteRequest={() => setDeleteTarget(node)}
                  onAddSub={sub => updateNode(folderDept, node.id, { subs: [...node.subs, sub], subCollapsed: false })}
                  onToggleSubs={() => isGuideFolderView
                    ? setGuideCollapsed(prev => ({ ...prev, [node.id]: !prev[node.id] }))
                    : updateNode(folderDept, node.id, { subCollapsed: !node.subCollapsed })}
                  isSelected={!isGuideFolderView && selectedFolderId === node.id}
                  selectedSub={selectedFolderId === node.id ? selectedFolderSub : null}
                  onSelect={() => {
                    if (isGuideFolderView) {
                      setGuideCollapsed(prev => ({ ...prev, [node.id]: !prev[node.id] }));
                      return;
                    }
                    if (selectedFolderId === node.id && selectedFolderSub === null) {
                      setSelectedFolderId(null);
                      setSelectedFolderSub(null);
                      onSelectFolder?.(folderDept, null, null);
                    } else {
                      setSelectedFolderId(node.id);
                      setSelectedFolderSub(null);
                      onSelectFolder?.(folderDept, node.name, null);
                    }
                  }}
                  onSelectSub={sub => {
                    if (selectedFolderId === node.id && selectedFolderSub === sub) {
                      setSelectedFolderId(null);
                      setSelectedFolderSub(null);
                      onSelectFolder?.(folderDept, null, null);
                    } else {
                      setSelectedFolderId(node.id);
                      setSelectedFolderSub(sub);
                      onSelectFolder?.(isGuideFolderView ? folderDept! : folderDept, isGuideFolderView ? null : node.name, sub);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">אין תיקיות עדיין</p>
          )}
          </div>
        </aside>

        {/* Delete confirmation modal */}
        {deleteTarget && (
          <DeleteFolderModal
            name={deleteTarget.name}
            onConfirm={() => { deleteNode(folderDept, deleteTarget.id); setDeleteTarget(null); }}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </>
    );
  }

  /* ══════════════════════════════════════
     NORMAL NAV VIEW
  ══════════════════════════════════════ */
  return (
    <aside
      className="w-64 flex-shrink-0 overflow-y-auto z-10 relative px-4 py-6 before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[1px] before:bg-[#E5E5E5]"
      dir="rtl">
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
                <div key={dept} onClick={() => clickSubItem('myEnvironment', dept, MY_ENV_NAME)} className={subItemClass(dept)}>
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
                  <div onClick={() => setExpandedOrg(prev => prev === org.name ? null : org.name)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full cursor-pointer text-right transition-all ${
                      expandedOrg === org.name ? 'text-gray-700 font-medium' : 'text-gray-600 hover:bg-white/60'
                    }`}>
                    <ChevronLeft className={`w-3 h-3 flex-shrink-0 text-gray-400 transition-transform ${expandedOrg === org.name ? '-rotate-90' : ''}`} />
                    <Folder className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                    <span className="flex-1">{org.name}</span>
                  </div>
                  {expandedOrg === org.name && (
                    <div className="mr-4 space-y-0.5">
                      {org.depts.map(dept => (
                        <div key={dept} onClick={() => clickSubItem('additionalEnvironments', dept, org.name)} className={subItemClass(dept)}>
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
                <div key={org} onClick={() => { setActiveSection('mainDocuments'); setExpandedSection('mainDocuments'); setActiveSubItem(org); onOpenCommandPage?.(org); }} className={subItemClass(org)}>
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
              <div onClick={() => clickSubItem('guide', 'מדיניות', 'מורה נבוכים')} className={subItemClass('מדיניות')}>
                <FileText className={folderIconClass('מדיניות')} />
                <span className="text-right flex-1">מדיניות</span>
              </div>
              <div onClick={() => clickSubItem('guide', 'הוראות', 'מורה נבוכים')} className={subItemClass('הוראות')}>
                <BookOpen className={folderIconClass('הוראות')} />
                <span className="text-right flex-1">הוראות</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
