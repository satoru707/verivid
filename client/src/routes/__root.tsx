import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { SnowflakeBackground } from '../components/SnowflakeBackground';
import { Navbar } from '../components/Navbar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E8F4FF] to-[#F0E8FF] relative overflow-x-hidden">
      <SnowflakeBackground />

      <Navbar />

      <main className="relative z-10">
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </main>
    </div>
  );
}
