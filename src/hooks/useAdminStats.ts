
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalContent: number;
  monthlyRevenue: number;
  totalRevenue: number;
  conversionRate: number;
  openTickets: number;
  chartData: Array<{
    date: string;
    events: number;
    revenue: number;
    users: number;
  }>;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      try {
        // Get total users
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Get active subscriptions
        const { count: activeSubscriptions } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_status', 'active');

        // Get total content
        const { count: totalContent } = await supabase
          .from('content')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Get payments for revenue calculation
        const { data: payments } = await supabase
          .from('payments')
          .select('amount, created_at')
          .eq('status', 'completed');

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyRevenue = payments?.filter(payment => {
          const paymentDate = new Date(payment.created_at);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        }).reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        // Calculate conversion rate
        const conversionRate = totalUsers ? Math.round((activeSubscriptions || 0) / totalUsers * 100) : 0;

        // Mock support tickets data (would come from support_tickets table in production)
        const openTickets = 5;

        // Generate chart data for the last 7 days
        const chartData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            events: Math.floor(Math.random() * 100) + 50,
            revenue: Math.floor(Math.random() * 1000) + 200,
            users: Math.floor(Math.random() * 50) + 10,
          };
        });

        return {
          totalUsers: totalUsers || 0,
          activeSubscriptions: activeSubscriptions || 0,
          totalContent: totalContent || 0,
          monthlyRevenue,
          totalRevenue,
          conversionRate,
          openTickets,
          chartData,
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
