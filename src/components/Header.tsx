import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-blue-700' : 'text-slate-600 hover:text-blue-700'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.site_title}
                className="w-10 h-10 rounded-xl object-contain bg-white shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-white text-xs font-bold">{settings.site_title.slice(0, 3)}</span>
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">{settings.site_title}</p>
              <p className="text-xs text-slate-500 leading-tight">{settings.site_subtitle}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass} end>
              Beranda
            </NavLink>
            <NavLink to="/layanan/langsung" className={navLinkClass}>
              Pelayanan Langsung
            </NavLink>
            <NavLink to="/layanan/tidak_langsung" className={navLinkClass}>
              Pelayanan Internal
            </NavLink>
            <NavLink to="/pengaduan" className={navLinkClass}>
              Pengaduan
            </NavLink>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <NavLink to="/" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700" end>
              Beranda
            </NavLink>
            <NavLink to="/layanan/langsung" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700">
              Pelayanan Langsung
            </NavLink>
            <NavLink to="/layanan/tidak_langsung" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700">
              Pelayanan Internal
            </NavLink>
            <NavLink to="/pengaduan" className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700">
              Pengaduan
            </NavLink>
            <Link to="/admin/login" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-700">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
