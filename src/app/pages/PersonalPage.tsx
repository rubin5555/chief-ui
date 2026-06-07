import { TopNavbar } from '../components/TopNavbar';
import { PersonalArea } from '../components/PersonalArea';

interface PersonalPageProps {
  navigate: (path: string) => void;
}

export function PersonalPage({ navigate }: PersonalPageProps) {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F6F9FC 0%, #F8FAFB 20%, #FAF8FA 35%, #FBF7F9 50%, #FAF5F1 65%, #F9F3ED 85%, #F9F3ED 100%)',
      backgroundAttachment: 'fixed'
    }} dir="rtl">
      <TopNavbar showBackArrow={true} isPersonalAreaActive={true} navigate={navigate} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PersonalArea />
      </div>
    </div>
  );
}
