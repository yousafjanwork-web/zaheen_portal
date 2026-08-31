import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-lime-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40">
      {/* Animated background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-blue-300/30 dark:bg-blue-500/10 blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-lime-300/25 dark:bg-lime-500/8 blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }} />
        <div className="absolute -bottom-40 right-1/4 w-[24rem] h-[24rem] rounded-full bg-indigo-300/25 dark:bg-indigo-500/8 blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
