import { useState, useEffect, Component, ReactNode } from 'react';
import { DesignPage } from './app/pages/DesignPage';
import { PersonalPage } from './app/pages/PersonalPage';
import { Catalog } from './app/pages/Catalog';
import { Edit } from './app/pages/Edit';

export interface EditDocInfo {
  id: string; name: string; status: string; orderNum: string;
}

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding: 40, fontFamily: 'monospace', direction: 'ltr'}}>
          <h2 style={{color: 'red'}}>Runtime Error:</h2>
          <pre style={{background: '#fee', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap'}}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [catalogInitDept, setCatalogInitDept] = useState<string | null>(null);
  const [editDocInfo, setEditDocInfo] = useState<EditDocInfo | null>(null);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const navigateToCatalog = (dept: string) => {
    setCatalogInitDept(dept);
    navigate('/catalog');
  };

  const navigateToEdit = (doc: EditDocInfo) => {
    setEditDocInfo(doc);
    navigate('/edit');
  };

  if (currentPath === '/personal') {
    return <PersonalPage navigate={navigate} />;
  }

  if (currentPath === '/catalog') {
    return <Catalog navigate={navigate} initialDept={catalogInitDept} onEditDoc={navigateToEdit} />;
  }

  if (currentPath === '/edit') {
    return <Edit navigate={navigate} doc={editDocInfo} />;
  }

  return <DesignPage navigate={navigate} onSelectDept={navigateToCatalog} />;
}

export default function AppWithBoundary() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}
