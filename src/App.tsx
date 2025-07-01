
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Player from "./pages/Player";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import AccountSettings from "./pages/AccountSettings";
import Pricing from "./pages/Pricing";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminProfile from "./pages/admin/AdminProfile";
import Analytics from "./pages/admin/Analytics";
import ApiKeys from "./pages/admin/ApiKeys";
import SystemManagement from "./pages/admin/SystemManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/api-keys" element={<ApiKeys />} />
          <Route path="/admin/system" element={<SystemManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
