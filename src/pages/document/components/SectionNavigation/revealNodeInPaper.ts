/**
 * How many times to re-aim after the journey ends. Each correction can itself
 * change what is rendered and therefore measured, so one is rarely enough and
 * three has always been; the loop stops early once nothing moves.
 */
const MAX_CORRECTIONS = 3;

/** Two frames at the same offset means the smooth scroll has finished. */
const isSettled = (container: HTMLElement, previous: number) => container.scrollTop === previous;

/**
 * Scroll a node in the paper into view, and keep it there while the sheet works
 * out how tall it is.
 *
 * The correction is the whole point. A topic the reader has never reached has
 * never been measured, so the virtualizer places it at an estimate — 420px per
 * topic — and mounting it is what finally lets the browser measure it. That
 * measurement lands *after* the scroll has been aimed, and moves every topic
 * below it. Aim once and you arrive at where the section used to be: a sliver of
 * it, or blank sheet where it hasn't reached yet.
 *
 * So: one smooth scroll for the journey, then instant corrections once the
 * journey is over. The corrections are invisible — the reader has already
 * stopped moving, and the section is only ever a few pixels out by then.
 */
export const revealNodeInPaper = (node: Element, container: HTMLElement) => {
  node.scrollIntoView({ behavior: 'smooth', block: 'start' });

  let previousScrollTop = Number.NaN;
  let corrections = 0;

  const step = () => {
    if (!isSettled(container, previousScrollTop)) {
      previousScrollTop = container.scrollTop;
      requestAnimationFrame(step);
      return;
    }

    // Settled. If measurement moved the node while the scroll was in flight, put
    // it right — without animating a second journey to do it.
    const before = container.scrollTop;
    node.scrollIntoView({ block: 'start' });
    corrections += 1;

    if (container.scrollTop !== before && corrections < MAX_CORRECTIONS) {
      previousScrollTop = Number.NaN;
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};
