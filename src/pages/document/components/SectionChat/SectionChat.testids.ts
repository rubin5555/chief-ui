export const SECTION_CHAT_IDS = {
  trigger: (sectionId: string) => `section-chat-trigger-${sectionId}`,
  panel: (sectionId: string) => `section-chat-panel-${sectionId}`,
  message: (id: string) => `section-chat-message-${id}`,

  quote: (id: string) => `section-chat-quote-${id}`,
  input: 'section-chat-input',
  sendBtn: 'section-chat-send',
  markerToggle: 'section-chat-marker-toggle',

  draftQuote: 'section-chat-draft-quote',
};
