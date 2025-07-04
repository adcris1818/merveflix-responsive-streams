
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Player from "./pages/Player";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ContentManager from "./pages/admin/ContentManager";
import ContentUpload from "./pages/admin/ContentUpload";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminPlans from "./pages/admin/AdminPlans";
import GuestPasses from "./pages/admin/GuestPasses";
import PaymentGateways from "./pages/admin/PaymentGateways";
import ApiKeys from "./pages/admin/ApiKeys";
import SystemManagement from "./pages/admin/SystemManagement";
import ContentModeration from "./pages/admin/ContentModeration";
import ApiManagement from "./pages/admin/ApiManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/content" element={<ContentManager />} />
            <Route path="/admin/content/upload" element={<ContentUpload />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/guest-passes" element={<GuestPasses />} />
            <Route path="/admin/payment-gateways" element={<PaymentGateways />} />
            <Route path="/admin/api-keys" element={<ApiKeys />} />
            <Route path="/admin/system" element={<SystemManagement />} />
            <Route path="/admin/moderation" element={<ContentModeration />} />
            <Route path="/admin/api-management" element={<ApiManagement />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
