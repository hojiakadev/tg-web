/** A Mantine modal, popover or menu is open — it owns the keyboard (e.g. Escape closes it first). */
export const isOverlayOpen = () => Boolean(document.querySelector('[role="dialog"], [role="menu"]'));

/** The event comes from a field the user is typing in. */
export const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
