
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseAdmin.auth.getUser(token);

    if (!user.user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', user.user.id)
      .single();

    if (!userData?.is_admin) {
      throw new Error('Admin access required');
    }

    const { method } = req;
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    switch (method) {
      case 'GET':
        const { data: users, error } = await supabaseAdmin
          .from('users')
          .select(`
            *,
            user_preferences(*),
            payments(amount, status, created_at)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return new Response(JSON.stringify(users), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!userId) throw new Error('User ID required for update');
        const updateData = await req.json();
        
        // Update user data
        const { data: updatedUser, error: updateError } = await supabaseAdmin
          .from('users')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        
        // If updating admin status, also update role
        if ('is_admin' in updateData) {
          await supabaseAdmin
            .from('users')
            .update({ 
              role: updateData.is_admin ? 'admin' : 'user'
            })
            .eq('id', userId);
        }
        
        return new Response(JSON.stringify(updatedUser), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!userId) throw new Error('User ID required for deletion');
        
        // Delete from auth.users (cascades to public.users)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        
        if (deleteError) throw deleteError;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Method not allowed');
    }

  } catch (error) {
    console.error('Error in user management:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
