import { Link } from 'react-router-dom';
import { Users, Mail, MessageSquare, MapPin, Phone, Megaphone } from 'lucide-react';

export default function ComplaintPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-white">Pengaduan</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Menyampaikan Keluhan, Saran & Masukan
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
            Bappelitbangda menyediakan beberapa kanal resmi bagi masyarakat maupun pegawai
            untuk berkonsultasi atau mengadukan pelayanan yang diterima.
          </p>
        </div>
      </section>

      {/* Channels */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Users,
              title: 'Tatap Muka Langsung',
              desc: 'Datang ke meja pengaduan Bappelitbangda, mengisi formulir pengaduan dengan data diri yang jelas dan dapat dipertanggungjawabkan.',
            },
            {
              icon: Mail,
              title: 'Email Resmi',
              desc: 'Kirimkan pengaduan atau konsultasi ke bappelitbangda663@gmail.com — kanal utama untuk seluruh jenis layanan.',
            },
            {
              icon: MessageSquare,
              title: 'WhatsApp & SP4N-LAPOR',
              desc: 'Pengaduan via WhatsApp 085 255 283 177, serta melalui Aplikasi Pengaduan SP4N-LAPOR.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">Hubungi Kami</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-2">
                <MapPin className="w-4 h-4" />
                Alamat
              </div>
              <p className="text-sm text-white leading-relaxed">
                Jalan Salotungo, Watansoppeng, Sulawesi Selatan, 90812
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-2">
                <Phone className="w-4 h-4" />
                Telepon / Faksimile
              </div>
              <p className="text-sm text-white">(0484) 21046</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-medium mb-2">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="text-sm text-white">bappelitbangda663@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
