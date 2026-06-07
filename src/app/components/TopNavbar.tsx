import { Bell, MessageCircle, User, ChevronDown, BookOpen, Eye, Edit, X, HelpCircle, Play, ExternalLink, ArrowRight, Lock, MessageSquare, Phone, ChevronLeft, ChevronRight, Filter, FileEdit, Copy, UserCog } from 'lucide-react';

function WordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* document shape with folded corner */}
      <path d="M2 2.5 C2 1.67 2.67 1 3.5 1 H10 L14 5 V13.5 C14 14.33 13.33 15 12.5 15 H3.5 C2.67 15 2 14.33 2 13.5 Z"
        stroke="#9ca3af" strokeWidth="1.1" fill="white"/>
      <path d="M10 1 L10 5 L14 5" stroke="#9ca3af" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
      {/* W centred in document */}
      <text x="8" y="12" fontSize="7" fontWeight="800" fill="#9ca3af"
        fontFamily="Arial,sans-serif" textAnchor="middle">W</text>
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* same document shape as Word */}
      <path d="M2 2.5 C2 1.67 2.67 1 3.5 1 H10 L14 5 V13.5 C14 14.33 13.33 15 12.5 15 H3.5 C2.67 15 2 14.33 2 13.5 Z"
        stroke="#9ca3af" strokeWidth="1.1" fill="white"/>
      <path d="M10 1 L10 5 L14 5" stroke="#9ca3af" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
      {/* Adobe-style mark inside — closed loop + diagonal + curl */}
      <path d="M 9 4.5 C 11 4, 12 5.5, 11 7 C 10 8.5, 7.5 8, 7.5 6.5 C 7.5 5.5 8.2 4.6 9 4.5 Z"
        stroke="#9ca3af" strokeWidth="0.9" fill="none"/>
      <path d="M 8.5 5 L 6 11.5"
        stroke="#9ca3af" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
      <path d="M 6 11.5 C 5.5 12.5 7 13 7.5 12"
        stroke="#9ca3af" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
import { useState, useRef, useEffect } from 'react';
import type React from 'react';

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
}

type DropPos = { top: number; left: number };

export function TopNavbar({ showBackArrow = false, isPersonalAreaActive = false, navigate, showDocActions = false, docHeader = null, onFilterClick, onEditDocClick }: TopNavbarProps) {
  const [realityMode, setRealityMode] = useState('מציאות');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

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
            <h2 className="text-[#1E3A8A]">Chief</h2>

            {showBackArrow && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/')}
                  className="p-1 rounded transition-colors hover:bg-gray-100 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  disabled
                  className="p-1 rounded cursor-default"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            )}

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
                <button title="סינון" onClick={onFilterClick}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  <Filter className="w-4 h-4 text-gray-400" />
                </button>
                <button title="עריכת פרטי מסמך" onClick={onEditDocClick}
                  className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                  <FileEdit className="w-4 h-4 text-gray-400" />
                </button>
                {([
                  { icon: Copy,     title: 'שכפול' },
                  { icon: UserCog,  title: 'הרשאות' },
                  { icon: WordIcon, title: 'ייצוא ל-Word' },
                  { icon: PdfIcon,  title: 'ייצוא PDF' },
                ] as { icon: React.ElementType; title: string }[]).map(({ icon: Icon, title }) => (
                  <button key={title} title={title}
                    className="p-1.5 rounded-full transition-colors hover:bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
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
              <Bell className={`w-5 h-5 ${activeIcon === 'bell' ? 'text-white' : 'text-gray-400'}`} />
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
              <MessageCircle className={`w-5 h-5 ${activeIcon === 'support' ? 'text-white' : 'text-gray-400'}`} />
            </button>

            {/* Book */}
            <button
              ref={bookRef}
              onClick={() => toggle('book', showTraining, setShowTraining, bookRef, setBookPos)}
              className={`p-1.5 rounded-full transition-all ${activeIcon === 'book' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <BookOpen className={`w-5 h-5 ${activeIcon === 'book' ? 'text-white' : 'text-gray-400'}`} />
            </button>

            <button
              onClick={() => { navigate('/personal'); setActiveIcon('user'); }}
              className={`p-1.5 rounded-full transition-all ${isPersonalAreaActive || activeIcon === 'user' ? 'bg-[#1B3A6B]' : ''}`}
            >
              <User className={`w-5 h-5 ${isPersonalAreaActive || activeIcon === 'user' ? 'text-white' : 'text-gray-400'}`} />
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
            <div className="space-y-2">
              {[
                { q: 'איך מחפשים מסמך?', a: 'כדי לחפש מסמך, השתמש בשדה החיפוש בחלק העליון של המסך או עבור לתפריט "כל המסמכים" בסרגל הצד.' },
                { q: 'איך מבקשים הרשאה?', a: 'לחץ על המסמך הרצוי, בחר "בקש הרשאה" מהתפריט, ובחר את סוג ההרשאה הנדרשת (צפייה או עריכה).' },
                { q: 'איך יוצרים תיקייה חדשה?', a: 'לחץ על כפתור "+" בחלק העליון של רשימת המסמכים, בחר "תיקייה חדשה" והזן את שם התיקייה.' },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-right"
                  >
                    <span className="text-sm text-gray-700">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFAQ === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFAQ === i && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-sm text-gray-600 text-right">{faq.a}</p>
                    </div>
                  )}
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
