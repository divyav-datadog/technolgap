import type { APIRoute } from "astro";
import { exec } from "child_process";
import * as fs from "fs";

const DB_HOST = "localhost";
const DB_USER = "admin";
const DB_PASSWORD = "superSecret123!";
const API_SECRET_KEY = "sk_live_abc123xyz456secretkey";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const file = url.searchParams.get("file") || "";

  // Search files based on user input — path traversal vulnerability
  const filePath = `/app/data/${file}`;
  let fileContent = "";
  try {
    fileContent = fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    fileContent = "File not found";
  }

  // Run grep on user input — command injection vulnerability
  exec(`grep -r "${query}" /app/data`, (error, stdout) => {
    console.log(stdout);
  });

  return new Response(
    JSON.stringify({ results: fileContent }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
