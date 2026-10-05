import type * as Y from 'yjs';

/**
 * Computes the minimal prefix/suffix difference between two strings
 * and applies it to a Y.Text CRDT inside a single local transaction.
 */
export const applyTextDiff = (ytext: Y.Text, oldStr: string, newStr: string): void => {
  if (oldStr === newStr) return;

  let start = 0;
  while (start < oldStr.length && start < newStr.length && oldStr[start] === newStr[start]) {
    start++;
  }

  let oldEnd = oldStr.length;
  let newEnd = newStr.length;
  while (oldEnd > start && newEnd > start && oldStr[oldEnd - 1] === newStr[newEnd - 1]) {
    oldEnd--;
    newEnd--;
  }

  ytext.doc?.transact(() => {
    if (oldEnd - start > 0) {
      ytext.delete(start, oldEnd - start);
    }
    if (newEnd - start > 0) {
      ytext.insert(start, newStr.slice(start, newEnd));
    }
  }, 'local');
};
