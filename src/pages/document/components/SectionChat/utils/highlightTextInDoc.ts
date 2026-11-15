import { DOC_NODE_ATTR, docNodeSelector } from '../../../document.constants';

interface CharPoint {
  node: Text;
  offset: number;
}

const collectChars = (root: Node) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let text = '';
  const points: CharPoint[] = [];

  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const raw = node.textContent ?? '';
    for (let offset = 0; offset < raw.length; offset += 1) {
      if (/\s/.test(raw[offset])) continue;
      text += raw[offset];
      points.push({ node, offset });
    }
  }

  return { text, points };
};

const rangeForQuote = (root: Node, quote: string): Range | null => {
  const { text, points } = collectChars(root);
  const needle = quote.replace(/\s/g, '');
  if (!needle) return null;

  const index = text.indexOf(needle);
  if (index === -1) return null;

  const start = points[index];
  const end = points[index + needle.length - 1];

  const range = document.createRange();
  range.setStart(start.node, start.offset);

  range.setEnd(end.node, end.offset + 1);
  return range;
};

export const highlightTextInDoc = (quote: string, sectionId: string): boolean => {
  const own = document.querySelector<HTMLElement>(docNodeSelector(sectionId));
  const rest = Array.from(document.querySelectorAll<HTMLElement>(`[${DOC_NODE_ATTR}]`)).filter(
    (node) => node !== own,
  );

  for (const root of own ? [own, ...rest] : rest) {
    const range = rangeForQuote(root, quote);
    if (!range) continue;

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    range.startContainer.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  return false;
};
