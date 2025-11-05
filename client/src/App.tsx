import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { WalletProvider } from './context/wallet-context';
import './styles/globals.css';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

export default function App() {
  return (
    <WalletProvider>
      <RouterProvider router={router} />;
    </WalletProvider>
  );
    
}
