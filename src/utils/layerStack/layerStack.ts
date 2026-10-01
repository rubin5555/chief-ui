/**
 * The top-level layer a node belongs to — the `document.body` child that
 * contains it. For the app itself that is the root element; for anything
 * portalled it is the portal's own element.
 */
const layerOf = (node: Node): Element | null => {
  let current: Node | null = node;
  while (current?.parentNode && current.parentNode !== document.body) current = current.parentNode;
  return current?.parentNode === document.body ? (current as Element) : null;
};

/**
 * Whether `target` sits on a layer stacked above `panel`.
 *
 * Popovers portal straight into `document.body`, so a date picker opened from
 * inside a filter panel ends up a *sibling* of that panel rather than a
 * descendant. An outside-click test that only asks "is the target inside me?"
 * reads a click on the calendar as a click outside the filter panel and closes
 * it — taking the calendar with it, so a date can never be picked.
 *
 * Mount order is stacking order, so a layer later in `body` is on top of one
 * before it, and a click there belongs to the panel above rather than being a
 * click away from this one.
 */
export const isOnLayerAbove = (panel: Element, target: Node) => {
  const panelLayer = layerOf(panel);
  const targetLayer = layerOf(target);
  if (!panelLayer || !targetLayer || panelLayer === targetLayer) return false;
  return Boolean(
    panelLayer.compareDocumentPosition(targetLayer) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
};
