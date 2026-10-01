const MAX_CORRECTIONS = 3;

const isSettled = (container: HTMLElement, previous: number) => container.scrollTop === previous;

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
