import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Building2, Plus, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/service';
import { getServiceIcon } from '@/components/ServiceIcon';

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('service_number', { ascending: true })
      .then(({ data }) => {
        setServices((data ?? []) as Service[]);
        setLoading(false);
      });
  }, []);

  const langsung = services.filter((s) => s.category === 'langsung');
  const tidakLangsung = services.filter((s) => s.category === 'tidak_langsung');
  const recentServices = services.slice(-5).reverse();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Ringkasan pengelolaan standar pelayanan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText, label: 'Total Layanan', value: services.length, color: 'bg-blue-50 text-blue-600' },
          { icon: Users, label: 'Pelayanan Langsung', value: langsung.length, color: 'bg-emerald-50 text-emerald-600' },
          { icon: Building2, label: 'Pelayanan Internal', value: tidakLangsung.length, color: 'bg-amber-50 text-amber-600' },
          { icon: Clock, label: 'Rata-rata Waktu', value: '15 hari', color: 'bg-purple-50 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Layanan Terbaru</h2>
            <Link
              to="/admin/services"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Lihat semua
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-400">Memuat...</div>
          ) : recentServices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400 mb-4">Belum ada layanan.</p>
              <Link
                to="/admin/services/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Layanan
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentServices.map((service) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <Link
                    key={service.id}
                    to={`/admin/services/${service.id}/edit`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {service.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {service.category === 'langsung' ? 'Pelayanan Langsung' : 'Pelayanan Internal'}
                        {' · '}
                        {service.duration}
                      </p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-slate-300" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-5">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link
              to="/admin/services/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Tambah Layanan</p>
                <p className="text-xs text-slate-500">Buat standar pelayanan baru</p>
              </div>
            </Link>
            <Link
              to="/admin/services"
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">Kelola Layanan</p>
                <p className="text-xs text-slate-500">Edit atau hapus layanan</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
