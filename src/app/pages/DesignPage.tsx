import { useState } from 'react';
import { MainContent } from '../components/MainContent';
import { TopNavbar } from '../components/TopNavbar';
import { RightSidebar } from '../components/RightSidebar';
import { NewDocModal } from './Catalog';

interface DesignPageProps {
  navigate: (path: string) => void;
  onSelectDept: (dept: string) => void;
  onOpenCommandPage?: (org: string) => void;
  onOpenDoc?: (doc: { name: string; organization: string }) => void;
}

export function DesignPage({ navigate, onSelectDept, onOpenCommandPage, onOpenDoc }: DesignPageProps) {
  const [showNewDoc, setShowNewDoc] = useState(false);
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F6F9FC 0%, #F8FAFB 20%, #FAF8FA 35%, #FBF7F9 50%, #FAF5F1 65%, #F9F3ED 85%, #F9F3ED 100%)',
      backgroundAttachment: 'fixed'
    }} dir="rtl">
      <TopNavbar showBackArrow={false} isPersonalAreaActive={false} navigate={navigate} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <RightSidebar onSelectDepartment={onSelectDept} onOpenCommandPage={onOpenCommandPage} />
        <MainContent onOpenDoc={onOpenDoc} onNewDoc={() => setShowNewDoc(true)} />
      </div>
      {showNewDoc && <NewDocModal onClose={() => setShowNewDoc(false)} />}
    </div>
  );
}
