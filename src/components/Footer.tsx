import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, FileText, Gavel } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_title}
                  className="w-10 h-10 rounded-xl object-contain bg-white shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{settings.site_title.slice(0, 3)}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{settings.site_title}</p>
                <p className="text-xs text-slate-400">{settings.site_subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah
              {settings.site_subtitle} — menyelenggarakan pelayanan perencanaan pembangunan
              sesuai standar dan kualitas pelayanan.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Kontak Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>Jalan Salotungo, Watansoppeng, Sulawesi Selatan, 90812</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>(0484) 21046</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>bappelitbangda663@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Dasar Hukum</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>UU No. 25 Tahun 2009 tentang Pelayanan Publik</span>
              </li>
              <li className="flex items-start gap-2">
                <Gavel className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>Peraturan Menteri PANRB No. 15 Tahun 2014</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Bappelitbangda {settings.site_subtitle}. Ditetapkan oleh Andi Agus Nongki, S.IP., M.Si.
            </p>
            <Link to="/admin/login" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
