export const SECTION_CHAT_IDS = {
  trigger: (sectionId: string) => `section-chat-trigger-${sectionId}`,
  panel: (sectionId: string) => `section-chat-panel-${sectionId}`,
  message: (id: string) => `section-chat-message-${id}`,
  /** The quoted-passage card inside a message — clicking it jumps to the text. */
  quote: (id: string) => `section-chat-quote-${id}`,
  input: 'section-chat-input',
  sendBtn: 'section-chat-send',
  markerToggle: 'section-chat-marker-toggle',
  /** The draft quote captured by the marker, before the message is sent. */
  draftQuote: 'section-chat-draft-quote',
};
