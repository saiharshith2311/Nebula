import { createClient } from "@supabase/supabase-js";
import { handleChat } from "../../lib/chatHandler.js";

export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const body = await request.json();
    let supabase = null;
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    }
    const result = await handleChat({
      message: body.message,
      history: body.history,
      supabase,
      env,
    });

    return new Response(
      JSON.stringify(
        result.status === 200
          ? { answer: result.answer, sources: result.sources }
          : { error: result.error }
      ),
      {
        status: result.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Chat failed." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
