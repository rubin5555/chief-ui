export * from './IconButton';
// The styled parts are part of this primitive's public surface: a trigger that
// needs its own ref (every useFloatingPanel consumer) can't go through the
// IconButton component, so it composes IconButtonRoot directly. Exported here
// so those callers import the barrel like everyone else instead of reaching
// past it into `IconButton.styles`.
export { IconButtonBadge, IconButtonRoot } from './IconButton.styles';
