import { DOC_NODE_ATTR, docNodeSelector } from '../../../document.constants';

/**
 * One character of the sheet's text, and where in the DOM it came from.
 * Whitespace is dropped — see `collectChars`.
 */
interface CharPoint {
  node: Text;
  offset: number;
}

/**
 * Every non-whitespace character under `root`, in reading order, paired with the
 * text node and offset it sits at.
 *
 * Whitespace is thrown away rather than normalised because the two strings being
 * compared disagree about it in ways no normalisation reconciles.
 * `Selection.toString()` puts a newline between blocks that the DOM's own text
 * has nothing between at all, and an inline tag can split a word into two text
 * nodes mid-character. Ignoring whitespace entirely sidesteps both: the marked
 * passage matches the passage it was marked from, whatever paragraph boundaries
 * or bold runs it crossed on the way.
 */
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

/** Selects `quote` within `root`, or returns null if it isn't in there. */
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
  // `+ 1` because the point addresses the character's own position, and a range's
  // end is the boundary after the last character it covers.
  range.setEnd(end.node, end.offset + 1);
  return range;
};

/**
 * Finds a quoted passage back in the sheet, selects it and scrolls it into view
 * (main's highlightTextInDoc, Edit.tsx:319). Returns whether it was found.
 *
 * Two differences from main, both about looking in the right place. main walks
 * `document.body` and takes the first text node containing the string, which
 * means a phrase appearing in more than one section lands on whichever comes
 * first in the document — and would happily match the copy of the text sitting in
 * the chat bubble itself. This searches the section the comment is filed under
 * first, then the remaining nodes of the sheet, and never anything outside them.
 *
 * The other is that main matches only within a single text node, so a passage
 * dragged across two paragraphs — the ordinary case — is never found again.
 */
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

    // The element rather than the range: `scrollIntoView` exists on the former,
    // and a passage's own paragraph is the unit a reader wants centred anyway.
    range.startContainer.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  return false;
};
