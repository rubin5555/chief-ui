import { ChevronDown } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ChevronWrapper, Dropdown, OptionBtn, Trigger } from './Select.styles';
import { SELECT_IDS } from './Select.testids';

interface DropPos {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

const EDGE_MARGIN = 8;
const GAP = 4;
const MAX_DROPDOWN_HEIGHT = 240;
const MIN_DROPDOWN_HEIGHT = 120;

const computeDropPos = (rect: DOMRect): DropPos => {
  const spaceBelow = window.innerHeight - rect.bottom - GAP - EDGE_MARGIN;
  const spaceAbove = rect.top - GAP - EDGE_MARGIN;

  // flip upward when there isn't enough room below but there's more room above — otherwise the
  // dropdown renders past the viewport bottom with no way to reach its lower options
  if (spaceBelow < MIN_DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
    return {
      bottom: window.innerHeight - rect.top + GAP,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(MAX_DROPDOWN_HEIGHT, spaceAbove),
    };
  }
  return {
    top: rect.bottom + GAP,
    left: rect.left,
    width: rect.width,
    maxHeight: Math.min(MAX_DROPDOWN_HEIGHT, Math.max(spaceBelow, MIN_DROPDOWN_HEIGHT)),
  };
};

interface SelectProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  'data-testid'?: string;
}

export const Select = ({
  options,
  placeholder = 'בחר...',
  value,
  onChange,
  id,
  'data-testid': testId,
}: SelectProps) => {
  const [internalSelected, setInternalSelected] = useState<string>('');
  // Derived, not synced via effect: a controlled parent's value always wins,
  // and uncontrolled usage falls back to the locally picked option.
  const selected = value ?? internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropPos, setDropPos] = useState<DropPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const base = testId ?? SELECT_IDS.root;

  const closeDropdown = () => setIsOpen(false);
  useClickOutside([triggerRef, dropRef], closeDropdown, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onDocumentKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const opt = options[highlightedIndex];
        if (opt) {
          setInternalSelected(opt);
          onChange?.(opt);
        }
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onDocumentKeyDown);
    return () => document.removeEventListener('keydown', onDocumentKeyDown);
  }, [isOpen, options, onChange, highlightedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const el = dropRef.current?.querySelector<HTMLElement>(
      `[data-option-index="${highlightedIndex}"]`,
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    // scrolling the trigger out from under the fixed-position dropdown leaves it floating
    // detached, so close immediately on any scroll that isn't inside the dropdown itself (e.g.
    // its own options list). No debounce and no refocus — both caused a visible delay/jump.
    const onScroll = (e: Event) => {
      if (dropRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [isOpen]);

  const onTriggerClick = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropPos(computeDropPos(rect));
      setHighlightedIndex(Math.max(options.indexOf(selected), 0));
    }
    setIsOpen((prev) => !prev);
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (isOpen) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTriggerClick();
    }
  };

  const onSelect = (opt: string) => () => {
    setInternalSelected(opt);
    onChange?.(opt);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const displayValue = selected || placeholder;
  const isPlaceholder = !selected;
  const activeOptionId = isOpen ? `${base}-option-${highlightedIndex}` : undefined;

  return (
    <>
      <Trigger
        ref={triggerRef}
        type="button"
        id={id}
        data-testid={base}
        $isPlaceholder={isPlaceholder}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${base}-listbox`}
        aria-activedescendant={activeOptionId}
      >
        <ChevronWrapper $open={isOpen}>
          <ChevronDown size={14} />
        </ChevronWrapper>
        <span>{displayValue}</span>
      </Trigger>

      {isOpen && dropPos && (
        <Dropdown
          ref={dropRef}
          id={`${base}-listbox`}
          data-testid={SELECT_IDS.dropdown}
          role="listbox"
          $pos={dropPos}
        >
          {options.map((opt, index) => (
            <OptionBtn
              key={opt}
              id={`${base}-option-${index}`}
              data-testid={SELECT_IDS.option(opt)}
              data-option-index={index}
              type="button"
              role="option"
              aria-selected={selected === opt}
              $selected={selected === opt}
              $highlighted={index === highlightedIndex}
              onClick={onSelect(opt)}
            >
              {opt}
            </OptionBtn>
          ))}
        </Dropdown>
      )}
    </>
  );
};
