import { MainContent } from '../components/MainContent';
import { TopNavbar } from '../components/TopNavbar';
import { RightSidebar } from '../components/RightSidebar';

interface DesignPageProps {
  navigate: (path: string) => void;
  onSelectDept: (dept: string) => void;
}

export function DesignPage({ navigate, onSelectDept }: DesignPageProps) {
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
        <RightSidebar onSelectDepartment={onSelectDept} />
        <MainContent />
      </div>
    </div>
  );
}
