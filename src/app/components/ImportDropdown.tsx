import { useState, useRef, useEffect } from 'react';
import { Download, ChevronRight, ChevronLeft, Plus, RefreshCw, Bell, Flag, BarChart2, FileText } from 'lucide-react';

interface ImportDropdownProps {
  onSelect?: (value: string) => void;
  onImportComplete?: () => void;
}

const SYSTEMS = [
  { key: 'unitree', label: 'UniTree', bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', letter: 'U' },
  { key: 'ganttit', label: 'Ganttit', bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]', letter: 'G' },
];

const ACTIONS: Record<string, Array<{ key: string; label: string; Icon: React.ElementType; bg: string; iconText: string }>> = {
  unitree: [
    { key: 'create', label: 'יצירת משימה', Icon: Plus, bg: 'bg-[#EFF6FF]', iconText: 'text-[#2563EB]' },
    { key: 'update', label: 'עדכון סטטוס', Icon: RefreshCw, bg: 'bg-[#F0FDF4]', iconText: 'text-[#16A34A]' },
    { key: 'notify', label: 'שליחת התראה', Icon: Bell, bg: 'bg-[#FFFBEB]', iconText: 'text-[#D97706]' },
  ],
  ganttit: [
    { key: 'milestone', label: 'יצירת אבן דרך', Icon: Flag, bg: 'bg-[#EFF6FF]', iconText: 'text-[#2563EB]' },
    { key: 'progress', label: 'עדכון התקדמות', Icon: BarChart2, bg: 'bg-[#F0FDF4]', iconText: 'text-[#16A34A]' },
    { key: 'report', label: 'יצוא דוח', Icon: FileText, bg: 'bg-[#FFFBEB]', iconText: 'text-[#D97706]' },
  ],
};

export function ImportDropdown({ onSelect, onImportComplete }: ImportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const updatePos = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 6, left: rect.left });
      }
    };
    updatePos();
  }, [isOpen]);

  const open = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 6, left: rect.left });
    }
    setIsOpen(true);
    setSelectedSystem(null);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedSystem(null);
  };

  const handleSystemClick = (key: string) => {
    setSelectedSystem(key);
  };

  const handleActionClick = (actionLabel: string) => {
    const sys = SYSTEMS.find((s) => s.key === selectedSystem);
    const label = sys ? `${sys.label} › ${actionLabel}` : actionLabel;
    onSelect?.(label);
    onImportComplete?.();
    close();
  };

  const currentSystem = SYSTEMS.find((s) => s.key === selectedSystem);
  const actions = selectedSystem ? ACTIONS[selectedSystem] : [];

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={open}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        type="button"
      >
        <Download className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && menuPos && (
        <div className="fixed inset-0 z-[99997]" onClick={close}>
          <div
            className="absolute bg-white rounded-2xl shadow-lg border border-gray-100 py-2"
            style={{ top: menuPos.top, left: menuPos.left, zIndex: 99998, minWidth: 200 }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {!selectedSystem ? (
              <>
                <div className="px-4 py-1.5 text-xs text-gray-400 font-medium">ייבוא ממערכת</div>
                {SYSTEMS.map((sys) => (
                  <button
                    key={sys.key}
                    onClick={() => handleSystemClick(sys.key)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    <div className={`w-8 h-8 rounded-full ${sys.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-xs font-bold ${sys.text}`}>{sys.letter}</span>
                    </div>
                    <span className="flex-1 text-sm text-gray-700">{sys.label}</span>
                    <ChevronLeft className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-1.5 border-b border-gray-100 mb-1">
                  <button
                    onClick={() => setSelectedSystem(null)}
                    className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                    type="button"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className={`w-6 h-6 rounded-full ${currentSystem!.bg} flex items-center justify-center`}>
                    <span className={`text-xs font-bold ${currentSystem!.text}`}>{currentSystem!.letter}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600">{currentSystem!.label}</span>
                </div>
                <div className="px-4 py-1 text-xs text-gray-400 font-medium">בחר פעולה</div>
                {actions.map(({ key, label, Icon, bg, iconText }) => (
                  <button
                    key={key}
                    onClick={() => handleActionClick(label)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${iconText}`} />
                    </div>
                    <span className="text-sm text-gray-700">{label}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
