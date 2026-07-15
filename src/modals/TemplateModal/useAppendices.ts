import { useState } from 'react';
import { reorderById } from '@/utils/reorderById';
import type { Appendix } from './TemplateModal.constants';

const makeAppendix = (): Appendix => ({
  id: `appendix-${self.crypto.randomUUID()}`,
  title: '',
  content: '',
  permissions: { approvers: [], editors: [] },
});

export const useAppendices = () => {
  const [appendices, setAppendices] = useState<Appendix[]>([]);

  const addAppendix = () => setAppendices((prev) => [...prev, makeAppendix()]);

  const removeAppendix = (id: string) =>
    setAppendices((prev) => prev.filter((appendix) => appendix.id !== id));

  const reorderAppendix = (draggedId: string, targetId: string) =>
    setAppendices((prev) => reorderById(prev, draggedId, targetId));

  const changeAppendixTitle = (id: string, title: string) =>
    setAppendices((prev) => prev.map((a) => (a.id !== id ? a : { ...a, title })));

  const changeAppendixContent = (id: string, content: string) =>
    setAppendices((prev) => prev.map((a) => (a.id !== id ? a : { ...a, content })));

  const changeAppendixPermissions = (id: string, permissions: Appendix['permissions']) =>
    setAppendices((prev) => prev.map((a) => (a.id !== id ? a : { ...a, permissions })));

  return {
    appendices,
    addAppendix,
    removeAppendix,
    reorderAppendix,
    changeAppendixTitle,
    changeAppendixContent,
    changeAppendixPermissions,
  };
};
