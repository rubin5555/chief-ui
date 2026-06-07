import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function CustomSelect({ options, placeholder = 'בחר...', value, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(value ?? '');
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const open = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  };

  const select = (opt: string) => {
    setSelected(opt);
    onChange?.(opt);
    setIsOpen(false);
  };

  const displayValue = selected || placeholder;
  const isPlaceholder = !selected;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 transition-colors hover:border-gray-400"
      >
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        <span className={`text-sm flex-1 text-right ${isPlaceholder ? 'text-gray-400' : 'text-gray-800'}`}>{displayValue}</span>
      </button>

      {isOpen && dropPos && (
        <div
          ref={dropRef}
          className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-y-auto"
          style={{
            top: dropPos.top,
            left: dropPos.left,
            width: dropPos.width,
            maxHeight: 240,
            zIndex: 99999,
          }}
          dir="rtl"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => select(opt)}
              className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${selected === opt ? 'text-[#1B3A6B] font-medium bg-[#EEF4FF]' : 'text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
