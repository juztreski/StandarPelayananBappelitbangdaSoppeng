import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, User, Loader2, FileText, Search, BadgeCheck, Users, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service, ServiceCategory } from '@/types/service';
import { getServiceIcon } from '@/components/ServiceIcon';

export default function ServiceListPage() {
  const { category } = useParams<{ category: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isLangsung = category === 'langsung';
  const title = isLangsung
    ? 'Pelayanan Langsung Kepada Masyarakat'
    : 'Pelayanan Tidak Langsung Kepada Masyarakat';
  const subtitle = isLangsung
    ? 'Layanan yang berinteraksi langsung dengan warga, pemohon data, maupun perangkat daerah lain.'
    : 'Layanan administrasi kepegawaian internal yang menunjang kelancaran organisasi.';

  useEffect(() => {
    setLoading(true);
    setSearch('');
    supabase
      .from('services')
      .select('*')
      .eq('category', category as ServiceCategory)
      .order('service_number', { ascending: true })
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
        setLoading(false);
      });
  }, [category]);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <section className={`relative overflow-hidden ${isLangsung ? 'bg-gradient-to-br from-blue-700 to-blue-900' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-white">{isLangsung ? 'Pelayanan Langsung' : 'Pelayanan Internal'}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              {isLangsung ? <Users className="w-7 h-7 text-white" /> : <Building2 className="w-7 h-7 text-white" />}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>
          </div>
          <p className="mt-3 text-blue-100 max-w-2xl leading-relaxed">{subtitle}</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium">
            <FileText className="w-4 h-4" />
            {services.length} layanan tersedia
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Service List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">
              {search ? 'Tidak ada layanan yang cocok dengan pencarian.' : 'Belum ada layanan dalam kategori ini.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service, idx) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={`/layanan/detail/${service.slug}`}
                  className="group bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-2xl font-bold text-slate-100 font-mono">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {service.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Gratis
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 group-hover:gap-2 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
