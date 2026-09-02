import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ServiceListPage from '@/pages/ServiceListPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import ComplaintPage from '@/pages/ComplaintPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminServiceList from '@/pages/admin/AdminServiceList';
import AdminServiceForm from '@/pages/admin/AdminServiceForm';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/layanan/:category" element={<ServiceListPage />} />
              <Route path="/layanan/detail/:slug" element={<ServiceDetailPage />} />
              <Route path="/pengaduan" element={<ComplaintPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="services" element={<AdminServiceList />} />
              <Route path="services/new" element={<AdminServiceForm />} />
              <Route path="services/:id/edit" element={<AdminServiceForm />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}
