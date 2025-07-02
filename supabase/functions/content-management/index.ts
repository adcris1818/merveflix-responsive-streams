
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
    const supabaseClient = createClient(
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

    const { method } = req;
    const url = new URL(req.url);
    const contentId = url.searchParams.get('id');

    switch (method) {
      case 'GET':
        if (contentId) {
          const { data, error } = await supabaseClient
            .from('content')
            .select('*')
            .eq('id', contentId)
            .single();
          
          if (error) throw error;
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          const { data, error } = await supabaseClient
            .from('content')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const newContent = await req.json();
        const { data: created, error: createError } = await supabaseClient
          .from('content')
          .insert([newContent])
          .select()
          .single();
        
        if (createError) throw createError;
        return new Response(JSON.stringify(created), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!contentId) throw new Error('Content ID required for update');
        const updateData = await req.json();
        const { data: updated, error: updateError } = await supabaseClient
          .from('content')
          .update(updateData)
          .eq('id', contentId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!contentId) throw new Error('Content ID required for deletion');
        const { error: deleteError } = await supabaseClient
          .from('content')
          .delete()
          .eq('id', contentId);
        
        if (deleteError) throw deleteError;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Method not allowed');
    }

  } catch (error) {
    console.error('Error in content management:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
