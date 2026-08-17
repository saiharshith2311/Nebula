import "dotenv/config";
import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { spawn } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import { handleChat } from "./lib/chatHandler.js";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const publicDir = existsSync(resolve("dist")) ? resolve("dist") : resolve("public");
const shouldOpen = process.argv.includes("--open");

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabase) {
  console.warn(
    "Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing in your .env file. API tables will use local fallbacks."
  );
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function getFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);

  return filePath.startsWith(publicDir) ? filePath : publicDir;
}

function openBrowser(url) {
  const command =
    process.platform === "win32"
      ? "cmd"
      : process.platform === "darwin"
        ? "open"
        : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];

  spawn(command, args, {
    detached: true,
    stdio: "ignore",
  }).unref();
}

// Helper to parse JSON body from POST requests
function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", (error) => {
      reject(error);
    });
  });
}

// Main HTTP Server
const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);

  // API Router Gateway
  if (url.pathname.startsWith("/api/")) {
    const table = url.pathname.replace("/api/", "");

    if (table === "config") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          supabaseUrl: process.env.SUPABASE_URL,
          supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
        })
      );
      return;
    }

    if (table === "chat") {
      if (request.method !== "POST") {
        response.writeHead(405, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }
      try {
        const body = await parseJsonBody(request);
        const result = await handleChat({
          message: body.message,
          history: body.history,
          supabase,
          env: process.env,
        });
        response.writeHead(result.status, { "Content-Type": "application/json" });
        response.end(
          JSON.stringify(
            result.status === 200
              ? { answer: result.answer, sources: result.sources }
              : { error: result.error }
          )
        );
      } catch (err) {
        console.error("Chat error:", err);
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Chat failed." }));
      }
      return;
    }
    // Supported tables
    if (!["reviews", "events", "placements", "departments"].includes(table)) {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Endpoint not found" }));
      return;
    }

    try {
      if (request.method === "GET") {
        if (!supabase) {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end("[]");
          return;
        }

        // Fetch all items from Supabase ordered by created_at descending
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data));
        return;
      }

      if (request.method === "POST") {
        if (!supabase) {
          response.writeHead(503, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ error: "Supabase is not configured." }));
          return;
        }

        const body = await parseJsonBody(request);

        // Handle file uploads (Supabase Storage Cloud Upload with Local Backup Fallback)
        if (body.file_data && body.file_name) {
          try {
            const matches = body.file_data.match(/^data:([^;]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
              const mimeType = matches[1];
              const buffer = Buffer.from(matches[2], "base64");
              const safeName = Date.now() + "_" + body.file_name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
              
              let fileUrl = null;
              let uploadSuccess = false;
              
              const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "campus-compass";
              try {
                console.log(`Attempting to upload file to Supabase bucket "${bucketName}"...`);
                const { data: storageData, error: storageErr } = await supabase.storage
                  .from(bucketName)
                  .upload(safeName, buffer, {
                    contentType: mimeType,
                    upsert: true
                  });
                
                if (storageErr) {
                  console.warn(`Supabase Storage upload failed: ${storageErr.message}. Falling back to local storage...`);
                } else {
                  const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(safeName);
                  
                  fileUrl = urlData.publicUrl;
                  uploadSuccess = true;
                  console.log(`Supabase Storage upload succeeded! File public URL: ${fileUrl}`);
                }
              } catch (storageErr) {
                console.warn(`Supabase Storage error: ${storageErr.message}. Falling back to local storage...`);
              }
              
              if (uploadSuccess && fileUrl) {
                body.description = body.description + `\n\n[Download Attached File: ${body.file_name}](${fileUrl})`;
              } else {
                // Local Fallback Storage
                const uploadsDir = join(publicDir, "uploads");
                await mkdir(uploadsDir, { recursive: true });
                await writeFile(join(uploadsDir, safeName), buffer);
                body.description = body.description + `\n\n[Download Attached File: ${body.file_name}](/uploads/${safeName})`;
              }
            }
          } catch (fileErr) {
            console.error("File upload error:", fileErr);
          }
          // Remove large file data before DB insert
          delete body.file_data;
          delete body.file_name;
        }

        // Save a new record in Supabase
        const { data, error } = await supabase
          .from(table)
          .insert([body])
          .select();

        if (error) throw error;

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data[0]));
        return;
      }

      // Method Not Allowed
      response.writeHead(405, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    } catch (dbError) {
      console.error(`Database error on ${request.method} /api/${table}:`, dbError);
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: dbError.message }));
      return;
    }
  }

  // Static File Server
  try {
    let filePath = getFilePath(request.url || "/");
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Standard Performance Caching headers
    const headers = {
      "Content-Type": contentType,
      // Revalidate HTML, JS, and CSS dynamically to prevent browser cache lockouts
      "Cache-Control": [".html", ".js", ".css"].includes(ext)
        ? "no-cache, must-revalidate"
        : "public, max-age=3600, must-revalidate",
    };

    response.writeHead(200, headers);
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Campus Compass running at ${url}`);

  if (shouldOpen) {
    openBrowser(url);
  }
});
