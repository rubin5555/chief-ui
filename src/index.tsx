import { ApolloProvider } from '@apollo/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { apolloClient } from './api/client';
import { routeTree } from './routeTree.gen';
import { GlobalStyles } from './styles/GlobalStyles';
import './styles/theme.css';
import 'quill/dist/quill.core.css';
import '@workspace/tiny-quill-editor/styles.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('לא נמצא אלמנט השורש #root — בדוק את תבנית ה-HTML');
}

createRoot(rootElement).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <GlobalStyles />
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
);
