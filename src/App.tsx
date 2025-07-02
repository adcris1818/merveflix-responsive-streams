
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuthContext } from '@/components/auth/AuthProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShows'));
const MyList = lazy(() => import('./pages/MyList'));
const Search = lazy(() => import('./pages/Search'));
const Profile = lazy(() => import('./pages/Profile'));
const Player = lazy(() => import('./pages/Player'));
const Pricing = lazy(() => import('./pages/Pricing'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

// Admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPlans = lazy(() => import('./pages/admin/AdminPlans'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const PaymentManagement = lazy(() => import('./pages/admin/PaymentManagement'));
const ApiKeys = lazy(() => import('./pages/admin/ApiKeys'));
const SystemManagement = lazy(() => import('./pages/admin/SystemManagement'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const ContentManager = lazy(() => import('./pages/admin/ContentManager'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { user, profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Layout Component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-white">Loading...</div>
            </div>
          }>
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } />
              
              {/* Protected User Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/movies" element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              } />
              <Route path="/tv-shows" element={
                <ProtectedRoute>
                  <TVShows />
                </ProtectedRoute>
              } />
              <Route path="/my-list" element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/player/:id" element={
                <ProtectedRoute>
                  <Player />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              } />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/content" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <ContentManager />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/plans" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminPlans />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <Analytics />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <PaymentManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/api-keys" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <ApiKeys />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/system" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <SystemManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminProfile />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
