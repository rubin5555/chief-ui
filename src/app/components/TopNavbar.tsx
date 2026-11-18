import { Bell, MessageCircle, User, ChevronDown, BookOpen, Eye, Edit, X, HelpCircle, Play, ExternalLink, ArrowRight, Lock, MessageSquare, Phone, ChevronLeft, ChevronRight, Filter, FileEdit, Copy, Trash2, UserCog, Loader2, Search, Plus, FileText, FileSpreadsheet, Users, Layers, List, PenLine, UserCheck, Network, Check, Download, RefreshCw, FilePlus, GitCompare, Inbox, Clock, XCircle, CheckCircle2, Undo2 } from 'lucide-react';

function WordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* document shape with folded corner */}
      <path d="M2 2.5 C2 1.67 2.67 1 3.5 1 H10 L14 5 V13.5 C14 14.33 13.33 15 12.5 15 H3.5 C2.67 15 2 14.33 2 13.5 Z"
        stroke="#6b7280" strokeWidth="1.1" fill="white"/>
      <path d="M10 1 L10 5 L14 5" stroke="#6b7280" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
      {/* W centred in document */}
      <text x="8" y="12" fontSize="7" fontWeight="800" fill="#6b7280"
        fontFamily="Arial,sans-serif" textAnchor="middle">W</text>
    </svg>
  );
}

function PdfIcon() {
  // Exact Adobe Acrobat "A" path (24×24 source), scaled into the document content area
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* document shape — same as WordIcon */}
      <path d="M2 2.5 C2 1.67 2.67 1 3.5 1 H10 L14 5 V13.5 C14 14.33 13.33 15 12.5 15 H3.5 C2.67 15 2 14.33 2 13.5 Z"
        stroke="#6b7280" strokeWidth="1.1" fill="white"/>
      <path d="M10 1 L10 5 L14 5" stroke="#6b7280" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
      {/* Adobe "A" logo — exact path from 24×24 viewBox, scaled & translated into doc body */}
      <g transform="translate(3.2, 2.8) scale(0.41)">
        <path
          fill="#6b7280"
          d="M23.63 15.3c-.71-.745-2.166-1.17-4.224-1.17-1.1 0-2.377.106-3.761.354a19.443 19.443 0 0 1-2.307-2.661c-.532-.71-.994-1.49-1.42-2.236.817-2.484 1.207-4.507 1.207-5.962 0-1.632-.603-3.336-2.342-3.336-.532 0-1.065.32-1.349.781-.78 1.384-.425 4.4.923 7.381a60.277 60.277 0 0 1-1.703 4.507c-.568 1.349-1.207 2.733-1.917 4.01C2.834 18.53.314 20.34.03 21.758c-.106.533.071 1.03.462 1.42.142.107.639.533 1.49.533 2.59 0 5.323-4.188 6.707-6.707 1.065-.355 2.13-.71 3.194-.994a34.963 34.963 0 0 1 3.407-.745c2.732 2.448 5.145 2.839 6.352 2.839 1.49 0 2.023-.604 2.2-1.1.32-.64.106-1.349-.213-1.704zm-1.42 1.03c-.107.532-.64.887-1.384.887-.213 0-.39-.036-.604-.071-1.348-.32-2.626-.994-3.903-2.059a17.717 17.717 0 0 1 2.98-.248c.746 0 1.385.035 1.81.142.497.106 1.278.426 1.1 1.348zm-7.524-1.668a38.01 38.01 0 0 0-2.945.674 39.68 39.68 0 0 0-2.52.745 40.05 40.05 0 0 0 1.207-2.555c.426-.994.78-2.023 1.136-2.981.354.603.745 1.207 1.135 1.739a50.127 50.127 0 0 0 1.987 2.378zM10.038 1.46a.768.768 0 0 1 .674-.425c.745 0 .887.851.887 1.526 0 1.135-.355 2.874-.958 4.861-1.03-2.768-1.1-5.074-.603-5.962zM6.134 17.997c-1.81 2.981-3.549 4.826-4.613 4.826a.872.872 0 0 1-.532-.177c-.213-.213-.32-.461-.249-.745.213-1.065 2.271-2.555 5.394-3.904Z"
        />
      </g>
    </svg>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { DocPermissionsModal } from './DocPermissionsModal';
export { DocPermissionsModal };

interface DocHeaderInfo {
  name: string; orderNum: string; env: string;
  template: string; dept: string; effectiveDate: string;
  classification: string; ref: string;
}

interface TopNavbarProps {
  showBackArrow?: boolean;
  isPersonalAreaActive?: boolean;
  navigate: (path: string) => void;
  showDocActions?: boolean;
  docHeader?: DocHeaderInfo | null;
  onFilterClick?: () => void;
  onEditDocClick?: () => void;
  onDuplicateClick?: () => void;
  onZoomChange?: (z: number) => void;
  onDocSearch?: (q: string) => void;
  permTrigger?: { tab: number } | null;
  onPermTriggerUsed?: () => void;
  docStatus?: string;
  onIssueUpdate?: () => void;
  onIssueNew?: () => void;
  onStartComparison?: (version: { label: string }) => void;
}

type DropPos = { top: number; left: number };

export function TopNavbar({ showBackArrow = false, isPersonalAreaActive = false, navigate, showDocActions = false, docHeader = null, onFilterClick, onEditDocClick, onDuplicateClick, onZoomChange, onDocSearch, permTrigger, onPermTriggerUsed, docStatus, onIssueUpdate, onIssueNew, onStartComparison }: TopNavbarProps) {
  const [realityMode, setRealityMode] = useState('מציאות');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDocPermissions, setShowDocPermissions] = useState(false);
  const [showReadingControl, setShowReadingControl] = useState(false);
  const [showIssueUpdate, setShowIssueUpdate] = useState(false);
  const [showIssueNew, setShowIssueNew] = useState(false);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const isDistributed = ['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה'].includes(docStatus ?? '');
  const [permModalTab, setPermModalTab] = useState(0);
  const [loadingExport, setLoadingExport] = useState<'word' | 'pdf' | null>(null);

  useEffect(() => {
    if (permTrigger) {
      setPermModalTab(permTrigger.tab);
      setShowDocPermissions(true);
      onPermTriggerUsed?.();
    }
  }, [permTrigger]);
  const [docZoom, setDocZoom] = useState(100);
  const [searchActive, setSearchActive] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const handleZoom = (delta: number) => {
    const next = Math.min(200, Math.max(50, docZoom + delta));
    setDocZoom(next);
    onZoomChange?.(next);
  };

  const handleSearchChange = (q: string) => {
    setNavSearch(q);
    onDocSearch?.(q);
  };

  const closeSearch = () => {
    setSearchActive(false);
    setNavSearch('');
    onDocSearch?.('');
  };

  const handleExport = (type: 'word' | 'pdf') => {
    if (loadingExport) return;
    setLoadingExport(type);
    setTimeout(() => setLoadingExport(null), 2000);
  };

  const [bellPos, setBellPos] = useState<DropPos | null>(null);
  const [supportPos, setSupportPos] = useState<DropPos | null>(null);
  const [bookPos, setBookPos] = useState<DropPos | null>(null);

  const bellRef = useRef<HTMLButtonElement>(null);
  const supportRef = useRef<HTMLButtonElement>(null);
  const bookRef = useRef<HTMLButtonElement>(null);

  const bellDropRef = useRef<HTMLDivElement>(null);
  const supportDropRef = useRef<HTMLDivElement>(null);
  const bookDropRef = useRef<HTMLDivElement>(null);

  const calcPos = (ref: React.RefObject<HTMLButtonElement | null>): DropPos | null => {
    if (!ref.current) return null;
    const r = ref.current.getBoundingClientRect();
    return { top: r.bottom + 8, left: r.left };
  };

  const closeAll = () => {
    setShowNotifications(false);
    setShowTraining(false);
    setShowFAQ(false);
    setShowSupport(false);
    setExpandedFAQ(null);
    setActiveIcon(null);
  };

  const toggle = (
    name: string,
    current: boolean,
    setter: (v: boolean) => void,
    ref: React.RefObject<HTMLButtonElement | null>,
    posSetter: (p: DropPos | null) => void,
  ) => {
    if (activeIcon === name) {
      closeAll();
    } else {
      closeAll();
      const pos = calcPos(ref);
      posSetter(pos);
      setActiveIcon(name);
      setter(true);
    }
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      const inBell = bellRef.current?.contains(target) || bellDropRef.current?.contains(target);
      const inSupport = supportRef.current?.contains(target) || supportDropRef.current?.contains(target);
      const inBook = bookRef.current?.contains(target) || bookDropRef.current?.contains(target);
      if (!inBell && !inSupport && !inBook) closeAll();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <>
      <nav className="px-6 py-6 relative" style={{ zIndex: 100 }} dir="rtl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/Chief.svg" alt="Chief" style={{ width: 26, height: 24 }} />
              <h2 className="text-[#1E3A8A]">Chief</h2>
            </div>


            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 bg-[#F2F2F4] px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-xs text-gray-700">{realityMode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
              </button>
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#F2F2F4] rounded-3xl shadow-lg z-10 min-w-[100px] overflow-hidden">
                  <button
                    onClick={() => { setRealityMode('אמת'); setShowDropdown(false); }}
                    className="w-full text-right px-4 py-1.5 hover:bg-white/30 text-xs text-gray-700"
                  >
                    אמת
                  </button>
                  <button
                    onClick={() => { setRealityMode('תרגיל'); setShowDropdown(false); }}
                    className="w-full text-right px-4 py-1.5 hover:bg-white/30 text-xs text-gray-700"
                  >
                    תרגיל
                  </button>
                </div>
              )}
            </div>

            {showDocActions && (
              <div className="flex items-center gap-1 mr-1">
                {/* action icons — differ by docStatus */}
                {!isDistributed && (
                  <button title="סינון" onClick={onFilterClick}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Filter className="w-4 h-4 text-gray-500" />
                  </button>
                )}
                <button title={isDistributed ? 'פרטי מסמך' : 'עריכת פרטי מסמך'} onClick={onEditDocClick}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  {isDistributed
                    ? <FileText className="w-4 h-4 text-gray-500" />
                    : <FileEdit className="w-4 h-4 text-gray-500" />}
                </button>
                {([
                  { icon: Copy,    title: 'שכפול', onClick: onDuplicateClick },
                  { icon: UserCog, title: isDistributed ? 'הרשאות ייצוא לוורד' : 'הרשאות', onClick: () => setShowDocPermissions(true) },
                ] as { icon: React.ElementType; title: string; onClick?: () => void }[]).map(({ icon: Icon, title, onClick }) => (
                  <button key={title} title={title} onClick={onClick}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
                {isDistributed && (<>
                  <button title="השוואת גרסאות" onClick={() => setShowVersionCompare(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <GitCompare className="w-4 h-4 text-gray-500" />
                  </button>
                  <button title="בקרת קריאה" onClick={() => setShowReadingControl(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button title="הוצאת עדכון למסמך" onClick={() => setShowIssueUpdate(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                  <button title="הוצאת מספר פקודה חדש" onClick={() => setShowIssueNew(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <FilePlus className="w-4 h-4 text-gray-500" />
                  </button>
                </>)}
                <button title="ייצוא ל-Word" onClick={() => handleExport('word')}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  {loadingExport === 'word'
                    ? <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                    : <WordIcon />}
                </button>
                <button title="ייצוא PDF" onClick={() => handleExport('pdf')}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  {loadingExport === 'pdf'
                    ? <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                    : <PdfIcon />}
                </button>

                {/* divider */}
                <span className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* zoom control */}
                <div className="flex items-center gap-0">
                  <button onClick={() => handleZoom(-10)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 font-bold text-base leading-none select-none">
                    −
                  </button>
                  <span className="text-xs text-gray-600 w-10 text-center tabular-nums">{docZoom}%</span>
                  <button onClick={() => handleZoom(10)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 font-bold text-base leading-none select-none">
                    +
                  </button>
                </div>

                {/* divider */}
                <span className="w-px h-4 bg-gray-200 mx-0.5" />

                {/* search in document */}
                {searchActive ? (
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
                    <Search className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <input
                      autoFocus
                      value={navSearch}
                      onChange={e => handleSearchChange(e.target.value)}
                      onKeyDown={e => e.key === 'Escape' && closeSearch()}
                      placeholder="חיפוש במסמך..."
                      dir="rtl"
                      className="text-xs bg-transparent outline-none w-32 text-right placeholder-gray-400"
                    />
                    <button onClick={closeSearch} className="p-0.5 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button title="חיפוש במסמך" onClick={() => setSearchActive(true)}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Search className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bell */}
            <button
              ref={bellRef}
              onClick={() => toggle('bell', showNotifications, setShowNotifications, bellRef, setBellPos)}
              className={`p-1.5 rounded-full transition-all relative ${activeIcon === 'bell' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <Bell className={`w-5 h-5 ${activeIcon === 'bell' ? 'text-white' : 'text-gray-500'}`} />
              {activeIcon !== 'bell' && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#1B3A6B] rounded-full"></span>
              )}
            </button>

            {/* Support */}
            <button
              ref={supportRef}
              onClick={() => toggle('support', showSupport, setShowSupport, supportRef, setSupportPos)}
              className={`p-1.5 rounded-full transition-all ${activeIcon === 'support' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <MessageCircle className={`w-5 h-5 ${activeIcon === 'support' ? 'text-white' : 'text-gray-500'}`} />
            </button>

            {/* Book */}
            <button
              ref={bookRef}
              onClick={() => toggle('book', showTraining, setShowTraining, bookRef, setBookPos)}
              className={`p-1.5 rounded-full transition-all ${activeIcon === 'book' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <BookOpen className={`w-5 h-5 ${activeIcon === 'book' ? 'text-white' : 'text-gray-500'}`} />
            </button>

            <button
              onClick={() => { navigate('/personal'); setActiveIcon('user'); }}
              className={`p-1.5 rounded-full transition-all ${isPersonalAreaActive || activeIcon === 'user' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <User className={`w-5 h-5 ${isPersonalAreaActive || activeIcon === 'user' ? 'text-white' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Bell dropdown — fixed */}
      {showNotifications && bellPos && (
        <div
          ref={bellDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-80 overflow-hidden"
          style={{ top: bellPos.top, left: bellPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button className="text-xs text-[#2D9B8A] hover:underline">סמן הכל כנקרא</button>
              <button
                onClick={closeAll}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-0">
              {[
                { icon: 'eye', text: 'ניתנה לך הרשאה לצפות במסמך "דוחות שנתיים"', time: 'לפני 5 דקות' },
                { icon: 'edit', text: 'קיבלת הרשאת עריכה במסמך "נהלי עבודה"', time: 'לפני 2 שעות' },
                { icon: 'eye', text: 'ניתנה לך הרשאה לצפות במסמך "מסמכי תקציב 2026"', time: 'לפני 3 שעות' },
                { icon: 'edit', text: 'קיבלת הרשאת עריכה במסמך "הסכמים משפטיים"', time: 'אתמול' },
                { icon: 'eye', text: 'ניתנה לך הרשאה לצפות במסמך "תיעוד טכני"', time: 'לפני 2 ימים' },
              ].map((n, i) => (
                <div key={i}>
                  <div className="py-3">
                    <div className="flex items-start gap-3">
                      {n.icon === 'eye'
                        ? <Eye className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        : <Edit className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      }
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 text-right">{n.text}</p>
                        <span className="text-xs text-gray-400 text-right">{n.time}</span>
                      </div>
                    </div>
                  </div>
                  {i < 4 && <div className="border-t border-gray-200"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Support dropdown — fixed */}
      {showSupport && supportPos && (
        <div
          ref={supportDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-52 overflow-hidden"
          style={{ top: supportPos.top, left: supportPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-2">
            <button
              onClick={() => { setShowPermissionsModal(true); closeAll(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">הרשאות</span>
            </button>
            <button
              onClick={() => window.open('#', '_blank')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">צ'אט תמיכה</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Book dropdown — fixed */}
      {showTraining && bookPos && !showFAQ && (
        <div
          ref={bookDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-52 overflow-hidden"
          style={{ top: bookPos.top, left: bookPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-2">
            <button
              onClick={() => setShowFAQ(true)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">הדרכה</span>
            </button>
            <button
              onClick={() => window.open('#', '_blank')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-right"
            >
              <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">לומדה</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>
      )}

      {showTraining && bookPos && showFAQ && (
        <div
          ref={bookDropRef}
          className="fixed bg-white rounded-2xl shadow-lg w-80 overflow-hidden"
          style={{ top: bookPos.top, left: bookPos.left, zIndex: 99999 }}
          dir="rtl"
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => { setShowFAQ(false); setExpandedFAQ(null); }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </button>
              <h3 className="text-sm font-medium text-gray-900">שאלות נפוצות</h3>
            </div>
            <div className="space-y-4">
              {([
                {
                  category: 'מסמכים שהופצו',
                  items: [
                    { q: 'איך מחפשים מסמך שהופץ?', a: 'השתמש בשדה החיפוש בחלק העליון של המסך או עבור לתפריט "כל המסמכים" בסרגל הצד.' },
                    { q: 'איך יודעים מי קרא מסמך שהופץ?', a: 'פתח את המסמך ולחץ על "בקרת קריאה" בתפריט העליון לצפייה ברשימת הקוראים.' },
                  ],
                },
                {
                  category: 'מסמכים בטיוטה',
                  items: [
                    { q: 'איך שומרים טיוטה?', a: 'המסמך נשמר אוטומטית בעת העריכה. ניתן למצוא אותו תחת "הסביבה שלי" בסרגל הצד.' },
                    { q: 'איך מפרסמים טיוטה?', a: 'בתוך המסמך לחץ על "הפצה" בפינה הימנית העליונה ובחר את רשימת התפוצה הרצויה.' },
                  ],
                },
                {
                  category: 'אזור אישי',
                  items: [
                    { q: 'איך משנים פרטי פרופיל?', a: 'לחץ על שם המשתמש בפינה הימנית העליונה ובחר "הגדרות פרופיל".' },
                  ],
                },
                {
                  category: 'כללי והרשאות',
                  items: [
                    { q: 'איך מבקשים הרשאה?', a: 'לחץ על המסמך הרצוי, בחר "בקש הרשאה" מהתפריט, ובחר את סוג ההרשאה הנדרשת.' },
                    { q: 'איך יוצרים תיקייה חדשה?', a: 'לחץ על כפתור "+" בחלק העליון של רשימת המסמכים ובחר "תיקייה חדשה".' },
                  ],
                },
              ] as { category: string; items: { q: string; a: string }[] }[]).map((section, si) => (
                <div key={si}>
                  <p className="text-xs font-semibold text-gray-400 mb-2 px-1 text-right" style={{ letterSpacing: '0.04em' }}>
                    {section.category}
                  </p>
                  <div className="space-y-1.5">
                    {section.items.map((faq, i) => {
                      const idx = si * 10 + i;
                      return (
                        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-right"
                          >
                            <span className="text-sm text-gray-700">{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandedFAQ === idx ? 'rotate-180' : ''}`} />
                          </button>
                          {expandedFAQ === idx && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                              <p className="text-sm text-gray-600 text-right">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDocPermissions && (
        <DocPermissionsModal onClose={() => setShowDocPermissions(false)} initialTab={permModalTab} isDistributed={isDistributed} />
      )}

      {/* Reading control modal */}
      {showReadingControl && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setShowReadingControl(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{ width: 480, maxHeight: '70vh' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-base text-gray-900">בקרת קריאה</h2>
              <button onClick={() => setShowReadingControl(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 font-semibold text-gray-600 text-xs">שם מלא</th>
                    <th className="pb-2 font-semibold text-gray-600 text-xs">תעודת זהות</th>
                    <th className="pb-2 font-semibold text-gray-600 text-xs">סביבה</th>
                    <th className="pb-2 font-semibold text-gray-600 text-xs">צפייה</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'כהן דוד', id: '123456789', env: 'אמ״ן', viewed: true },
                    { name: 'לוי יוסף', id: '987654321', env: 'חיל השריון', viewed: true },
                    { name: 'גולן אריאל', id: '456789123', env: 'חיל הרגלים', viewed: false },
                    { name: 'מזרחי נועם', id: '321654987', env: 'חיל האוויר', viewed: false },
                  ].map((u, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 text-xs text-gray-800">{u.name}</td>
                      <td className="py-2 text-xs text-gray-500">{u.id}</td>
                      <td className="py-2 text-xs text-gray-500">{u.env}</td>
                      <td className="py-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={u.viewed ? { background: '#DCFCE7', color: '#166534' } : { background: '#F3F4F6', color: '#6B7280' }}>
                          {u.viewed ? 'נצפה' : 'טרם נצפה'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Issue update warning modal */}
      {showIssueUpdate && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => setShowIssueUpdate(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">שימו לב</h2>
              <button onClick={() => setShowIssueUpdate(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                עדכון חדש למסמך יוצר גרסה נוספת למסמך. ברגע שמסמך זה ייכנס לתוקף, הוא יבטל את המסמך הקודם והמסמך הקודם יישמר בהיסטורית הפקודה.
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-700">מה ההבדל בין יצירת מס׳ פקודה חדש לבין הוצאת עדכון?</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים מס׳ פקודה חדש</span> — מחליטים על שינוי מהותי של תכלית המסמך.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים עדכון לפקודה</span> — ישנם סעיפים שמשתנים מהפקודה הקודמת, אך תכליתו נשארת זהה.
                </p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowIssueUpdate(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button onClick={() => { setShowIssueUpdate(false); onIssueUpdate?.(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                המשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue new command number warning modal */}
      {showIssueNew && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => setShowIssueNew(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">שימו לב</h2>
              <button onClick={() => setShowIssueNew(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                יצירת מס׳ פקודה חדש יוצרת גרסה נוספת למסמך. ברגע שמסמך זה ייכנס לתוקף, הוא יבטל את המסמך הקודם והמסמך הקודם יישמר בהיסטורית הפקודה.
              </p>
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-700">מה ההבדל בין יצירת מס׳ פקודה חדש לבין הוצאת עדכון?</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים מס׳ פקודה חדש</span> — מחליטים על שינוי מהותי של תכלית המסמך.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-medium text-gray-700">כאשר מוציאים עדכון לפקודה</span> — ישנם סעיפים שמשתנים מהפקודה הקודמת, אך תכליתו נשארת זהה.
                </p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowIssueNew(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button onClick={() => { setShowIssueNew(false); onIssueNew?.(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                המשך
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version compare modal */}
      {showVersionCompare && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowVersionCompare(false)}>
          <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 720 }}
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800">השוואת גרסאות</h2>
              <button onClick={() => setShowVersionCompare(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Version list */}
            <div className="flex flex-col divide-y divide-gray-100">
              {[
                { label: 'עדכון מס׳ 2', datetime: '14.07.2026, 09:32', ref: 'א׳-2026-147', approvedBy: 'אל״מ דוד כהן', tag: 'נוכחית' },
                { label: 'עדכון מס׳ 1', datetime: '01.06.2026, 14:15', ref: 'א׳-2026-088', approvedBy: 'אל״מ דוד כהן', tag: '' },
                { label: 'פקודה מס׳ 001', datetime: '15.03.2026, 11:00', ref: 'א׳-2026-031', approvedBy: 'תא״ל רונן לוי', tag: '' },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{v.label}</span>
                      {v.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: '#1B3A6B18', color: '#1B3A6B' }}>{v.tag}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      עודכן ב-{v.datetime} &nbsp;·&nbsp; סימוכין: {v.ref} &nbsp;·&nbsp; אושר ע״י: {v.approvedBy}
                    </span>
                  </div>
                  <button
                    onClick={() => { onStartComparison?.({ label: v.label }); setShowVersionCompare(false); }}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: '#1B3A6B' }}>
                    השוואה
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPermissionsModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999 }}
          onClick={() => setShowPermissionsModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-[600px] max-w-[90vw] p-8"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-900 mb-2">טיפול בהרשאות</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  לצפייה במסמכים ופתיחת הרשאות למערכת יש לפנות אל הפיקוד הרלוונטי אליך
                </p>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 mr-4"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-0 mt-6">
              {['ארגון א\'', 'ארגון ב\'', 'ארגון ג\'', 'ארגון ד\''].map((org, i) => (
                <div key={i}>
                  <div className="py-4 flex items-center justify-between">
                    <span className="text-gray-800">{org}</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">050-1234567</span>
                    </div>
                    <button className="p-2 hover:bg-[#2D9B8A]/10 rounded-full transition-colors">
                      <MessageSquare className="w-5 h-5 text-[#2D9B8A]" />
                    </button>
                  </div>
                  {i < 3 && <div className="border-t border-gray-200"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
