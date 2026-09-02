import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-3">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.site_title}
                className="w-10 h-10 rounded-xl object-contain shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{settings.site_title.slice(0, 3)}</span>
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">{settings.site_title}</p>
              <p className="text-xs text-slate-500 leading-tight">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin" className={navLinkClass} end>
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/services" className={navLinkClass}>
            <FileText className="w-4 h-4" />
            Layanan
          </NavLink>
          <NavLink to="/admin/settings" className={navLinkClass}>
            <Settings className="w-4 h-4" />
            Pengaturan Situs
          </NavLink>
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Lihat Situs
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
          {user?.email && (
            <p className="px-4 pt-2 text-xs text-slate-400 truncate">{user.email}</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
}
