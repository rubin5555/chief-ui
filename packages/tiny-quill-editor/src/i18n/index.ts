import { EditorLocale, EditorTranslations, TextDirection } from './types';
import { enTranslations } from './en';
import { heTranslations } from './he';

export type { EditorLocale, EditorTranslations, TextDirection };
export { enTranslations, heTranslations };

export const defaultEditorTranslations: EditorTranslations = enTranslations;
export const defaultTranslations: EditorTranslations = enTranslations;

export const allTranslations: Record<EditorLocale, EditorTranslations> = {
  en: enTranslations,
  he: heTranslations,
};

export function getEditorTranslations(
  locale: EditorLocale = 'en',
  custom?: Partial<EditorTranslations>
): EditorTranslations {
  const base = allTranslations[locale] || allTranslations.en;
  if (!custom) return base;
  return {
    ...base,
    ...custom,
    common: { ...base.common, ...custom.common },
    menubar: { ...base.menubar, ...custom.menubar },
    toolbar: { ...base.toolbar, ...custom.toolbar },
    tableToolbar: { ...base.tableToolbar, ...custom.tableToolbar },
    contextMenu: { ...base.contextMenu, ...custom.contextMenu },
    modals: { ...base.modals, ...custom.modals },
    image: { ...base.image, ...custom.image },
    statusbar: { ...base.statusbar, ...custom.statusbar },
    findReplace: { ...base.findReplace, ...custom.findReplace },
    toasts: { ...base.toasts, ...custom.toasts },
  };
}
