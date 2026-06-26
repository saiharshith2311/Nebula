import { createClient } from "@supabase/supabase-js";

export async function onRequest(context) {
  const { request, env, params } = context;
  const table = params.table;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!["reviews", "events", "placements", "departments"].includes(table)) {
    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseAnonKey = env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: "Supabase credentials not configured." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    if (request.method === "GET") {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (request.method === "POST") {
      const body = await request.json();

      // Handle file uploads via Supabase Storage
      if (body.file_data && body.file_name) {
        try {
          const matches = body.file_data.match(/^data:([^;]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const binaryString = atob(matches[2]);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            const safeName = Date.now() + "_" + body.file_name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
            const bucketName = env.SUPABASE_STORAGE_BUCKET || "campus-compass";

            const { error: storageErr } = await supabase.storage
              .from(bucketName)
              .upload(safeName, bytes.buffer, { contentType: mimeType, upsert: true });

            if (!storageErr) {
              const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(safeName);
              body.description = body.description + `\n\n[Download Attached File: ${body.file_name}](${urlData.publicUrl})`;
            }
          }
        } catch (fileErr) {
          console.error("File upload error:", fileErr);
        }
        delete body.file_data;
        delete body.file_name;
      }

      const { data, error } = await supabase
        .from(table)
        .insert([body])
        .select();

      if (error) throw error;

      return new Response(JSON.stringify(data[0]), {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (dbError) {
    return new Response(
      JSON.stringify({ error: dbError.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
