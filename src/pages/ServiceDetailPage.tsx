import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Clock, BadgeCheck, FileText, ClipboardCheck,
  Megaphone, User, Loader2, Package, Mail, MessageSquare, Users,
  ChevronRight, Printer, CheckCircle2, ListChecks, Building2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/service';
import { getServiceIcon } from '@/components/ServiceIcon';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      supabase.from('services').select('*').eq('slug', slug).maybeSingle(),
      supabase.from('services').select('*').order('category', { ascending: true }).order('service_number', { ascending: true }),
    ]).then(([detailRes, listRes]) => {
      setService((detailRes.data as Service) ?? null);
      setAllServices((listRes.data ?? []) as Service[]);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 mb-4">Layanan tidak ditemukan.</p>
        <Link to="/" className="text-blue-700 hover:text-blue-800 font-medium">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  const Icon = getServiceIcon(service.icon);
  const isLangsung = service.category === 'langsung';

  // Parse procedure into numbered steps
  const procedureSteps = service.procedure
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter((line) => line.length > 0);

  // Parse requirements into list items
  const requirementItems = service.requirements
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter((line) => line.length > 0);

  // Find prev/next services in same category
  const sameCategory = allServices.filter((s) => s.category === service.category);
  const currentIndex = sameCategory.findIndex((s) => s.id === service.id);
  const prevService = currentIndex > 0 ? sameCategory[currentIndex - 1] : null;
  const nextService = currentIndex < sameCategory.length - 1 ? sameCategory[currentIndex + 1] : null;

  const quickInfoCards = [
    { icon: Clock, label: 'Jangka Waktu', value: service.duration, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: BadgeCheck, label: 'Biaya', value: service.cost, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Package, label: 'Produk', value: service.product, color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: User, label: 'Penanggung Jawab', value: service.responsible_person || '-', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <Link to="/" className="hover:text-blue-700 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/layanan/${service.category}`} className="hover:text-blue-700 transition-colors">
              {isLangsung ? 'Pelayanan Langsung' : 'Pelayanan Internal'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700 truncate max-w-xs">{service.name}</span>
          </nav>
        </div>
      </div>

      {/* Service Header */}
      <section className={`relative overflow-hidden ${isLangsung ? 'bg-gradient-to-br from-blue-700 to-blue-900' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-300 rounded-full blur-3xl -ml-30 -mb-30" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link
            to={`/layanan/${service.category}`}
            className="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke daftar layanan
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  isLangsung ? 'bg-blue-500/30 text-blue-100' : 'bg-slate-500/30 text-slate-100'
                }`}>
                  {isLangsung ? <Users className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                  {isLangsung ? 'Pelayanan Langsung' : 'Pelayanan Internal'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                {service.name}
              </h1>
              <p className="mt-3 text-blue-100 leading-relaxed max-w-2xl">{service.description}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/20 shrink-0"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </button>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickInfoCards.map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-xs text-slate-400 mb-0.5">{card.label}</p>
              <p className="text-sm font-semibold text-slate-900 leading-snug">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Requirements + Procedure */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirements */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Persyaratan</h2>
                  <p className="text-xs text-slate-400">Dokumen & identitas yang wajib dibawa</p>
                </div>
              </div>
              <div className="px-6 py-5">
                <ul className="space-y-3">
                  {requirementItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                      </div>
                      <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Procedure - Step by Step */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Sistem & Prosedur</h2>
                  <p className="text-xs text-slate-400">Tahapan mekanisme dari pengajuan hingga selesai</p>
                </div>
              </div>
              <div className="px-6 py-6">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-200" />
                  <div className="space-y-5">
                    {procedureSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 z-10 text-sm font-bold shadow-md shadow-blue-600/30">
                          {i + 1}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product + Complaint */}
          <div className="space-y-6">
            {/* Product */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Produk Layanan</h2>
                  <p className="text-xs text-slate-400">Hasil akhir yang diterima</p>
                </div>
              </div>
              <div className="px-5 py-5">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50/50 border border-amber-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">{service.product}</p>
                </div>
              </div>
            </div>

            {/* Complaint Handling */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Penanganan Pengaduan</h2>
                  <p className="text-xs text-slate-400">Kanal untuk keluhan & saran</p>
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{service.complaint_handling}</p>
                <div className="space-y-2">
                  <Link
                    to="/pengaduan"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                  >
                    <Megaphone className="w-4 h-4" />
                    Form Pengaduan
                  </Link>
                  <a
                    href="mailto:bappelitbangda663@gmail.com"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Pengaduan
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-semibold">Ringkasan</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Waktu</span>
                  <span className="font-medium">{service.duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Biaya</span>
                  <span className="font-medium">{service.cost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kategori</span>
                  <span className="font-medium">{isLangsung ? 'Langsung' : 'Internal'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prev/Next Navigation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevService ? (
            <Link
              to={`/layanan/detail/${prevService.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Layanan Sebelumnya</p>
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  {prevService.name}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextService ? (
            <Link
              to={`/layanan/detail/${nextService.slug}`}
              className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all text-right"
            >
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Layanan Berikutnya</p>
                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  {nextService.name}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
