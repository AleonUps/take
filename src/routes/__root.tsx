import { createRootRouteWithContext, Outlet, Link } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { SiteNav, SiteFooter } from '@/components/site-chrome';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="text-center">
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--oracle)', opacity: 0.5 }}>// ERROR_404</p>
        <h1 className="text-7xl font-black" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>404</h1>
        <h2 className="mt-4 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Page not found</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          This node does not exist in the current pipeline.
        </p>
        <Link to="/" className="btn-oracle mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm">
          Return to Base
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
