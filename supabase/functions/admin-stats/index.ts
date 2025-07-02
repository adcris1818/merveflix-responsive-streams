
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

interface Database {
  public: {
    Tables: {
      users: any;
      content: any;
      payments: any;
      analytics_events: any;
      support_tickets: any;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: userData } = await supabaseClient
      .from('users')
      .select('is_admin')
      .eq('id', user.user.id)
      .single();

    if (!userData?.is_admin) {
      throw new Error('Admin access required');
    }

    // Get comprehensive stats
    const [
      { count: totalUsers },
      { count: activeSubscriptions },
      { count: totalContent },
      { data: revenueData },
      { count: supportTickets },
      { data: analyticsData }
    ] = await Promise.all([
      supabaseClient.from('users').select('*', { count: 'exact', head: true }),
      supabaseClient.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
      supabaseClient.from('content').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseClient.from('payments').select('amount, created_at').eq('status', 'completed').order('created_at', { ascending: false }).limit(30),
      supabaseClient.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabaseClient.from('analytics_events').select('event_type, created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).limit(1000)
    ]);

    // Calculate revenue metrics
    const totalRevenue = revenueData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
    const monthlyRevenue = revenueData?.filter(payment => 
      new Date(payment.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

    // Prepare chart data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayEvents = analyticsData?.filter(event => 
        event.created_at.startsWith(date)
      ).length || 0;
      
      return {
        date,
        events: dayEvents,
        revenue: revenueData?.filter(payment => 
          payment.created_at.startsWith(date)
        ).reduce((sum, payment) => sum + Number(payment.amount), 0) || 0
      };
    });

    const stats = {
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalContent: totalContent || 0,
      totalRevenue,
      monthlyRevenue,
      openTickets: supportTickets || 0,
      chartData,
      conversionRate: totalUsers ? ((activeSubscriptions || 0) / totalUsers * 100).toFixed(2) : '0.00'
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
