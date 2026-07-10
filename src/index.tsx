import { ApolloProvider } from '@apollo/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { apolloClient } from './api/client';
import { routeTree } from './routeTree.gen';
import { GlobalStyles } from './styles/GlobalStyles';
import './styles/theme.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <GlobalStyles />
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
);
