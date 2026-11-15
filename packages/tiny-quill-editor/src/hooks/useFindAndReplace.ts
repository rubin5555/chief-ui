'use client';

import { useCallback, useState } from 'react';

interface UseFindAndReplaceParams {
  quillInstanceRef: React.MutableRefObject<any>;
  pushHistorySnapshot: (immediate?: boolean) => void;
  showToast: (msg: string) => void;
}

export function useFindAndReplace({
  quillInstanceRef,
  pushHistorySnapshot,
  showToast,
}: UseFindAndReplaceParams) {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  const handleReplaceAll = useCallback(() => {
    if (!findQuery.trim()) return;
    const quill = quillInstanceRef.current;
    if (!quill || !quill.root) return;

    const root = quill.root as HTMLElement;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let current = walker.nextNode();
    while (current) {
      textNodes.push(current as Text);
      current = walker.nextNode();
    }

    let count = 0;
    const escaped = findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');

    textNodes.forEach((node) => {
      if (node.nodeValue && regex.test(node.nodeValue)) {
        const matches = node.nodeValue.match(regex);
        count += matches ? matches.length : 0;
        node.nodeValue = node.nodeValue.replace(regex, replaceQuery);
      }
    });

    if (count > 0) {
      pushHistorySnapshot(true);
      showToast(`Replaced ${count} occurrence${count > 1 ? 's' : ''}`);
    } else {
      showToast(`No matches found for "${findQuery}"`);
    }
  }, [findQuery, pushHistorySnapshot, quillInstanceRef, replaceQuery, showToast]);

  return {
    showFindReplace,
    setShowFindReplace,
    findQuery,
    setFindQuery,
    replaceQuery,
    setReplaceQuery,
    handleReplaceAll,
  };
}
