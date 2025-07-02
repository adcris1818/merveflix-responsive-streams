
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Index from './pages/Index';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import MyList from './pages/MyList';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import Player from './pages/Player';
import AccountSettings from './pages/AccountSettings';
import Onboarding from './pages/Onboarding';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import ContentManager from './pages/admin/ContentManager';
import ContentUpload from './pages/admin/ContentUpload';
import ContentModeration from './pages/admin/ContentModeration';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import Analytics from './pages/admin/Analytics';
import PaymentManagement from './pages/admin/PaymentManagement';
import PaymentGateways from './pages/admin/PaymentGateways';
import GuestPasses from './pages/admin/GuestPasses';
import ApiKeys from './pages/admin/ApiKeys';
import ApiManagement from './pages/admin/ApiManagement';
import SystemManagement from './pages/admin/SystemManagement';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/content/upload" element={<ContentUpload />} />
            <Route path="/admin/moderation" element={<ContentModeration />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/payments" element={<PaymentManagement />} />
            <Route path="/admin/payment-gateways" element={<PaymentGateways />} />
            <Route path="/admin/guest-passes" element={<GuestPasses />} />
            <Route path="/admin/api-keys" element={<ApiKeys />} />
            <Route path="/admin/api-management" element={<ApiManagement />} />
            <Route path="/admin/system" element={<SystemManagement />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
