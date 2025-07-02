
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import Pricing from "./pages/Pricing";
import Player from "./pages/Player";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import Analytics from "./pages/admin/Analytics";
import PaymentManagement from "./pages/admin/PaymentManagement";
import ApiKeys from "./pages/admin/ApiKeys";
import SystemManagement from "./pages/admin/SystemManagement";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSettings from "./pages/admin/AdminSettings";
import ContentManager from "./pages/admin/ContentManager";
import ContentUpload from "./pages/admin/ContentUpload";
import GuestPasses from "./pages/admin/GuestPasses";
import PaymentGateways from "./pages/admin/PaymentGateways";

const queryClient = new QueryClient();

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Admin Route component for admin users
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Protected user routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
            <Route path="/tv-shows" element={<ProtectedRoute><TVShows /></ProtectedRoute>} />
            <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            <Route path="/player/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/plans" element={<AdminRoute><AdminPlans /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
            <Route path="/admin/payments" element={<AdminRoute><PaymentManagement /></AdminRoute>} />
            <Route path="/admin/api-keys" element={<AdminRoute><ApiKeys /></AdminRoute>} />
            <Route path="/admin/system" element={<AdminRoute><SystemManagement /></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/content" element={<AdminRoute><ContentManager /></AdminRoute>} />
            <Route path="/admin/content/upload" element={<AdminRoute><ContentUpload /></AdminRoute>} />
            <Route path="/admin/guest-passes" element={<AdminRoute><GuestPasses /></AdminRoute>} />
            <Route path="/admin/payment-gateways" element={<AdminRoute><PaymentGateways /></AdminRoute>} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
