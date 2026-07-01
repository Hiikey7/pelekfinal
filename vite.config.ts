import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import authHandler from "./api/auth";
import dbHandler from "./api/db";
import functionHandler from "./api/functions/[name]";
import healthHandler from "./api/health";
import uploadHandler from "./api/upload";

async function readJsonBody(req: any) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function createDevApiResponse(res: any) {
  let statusCode = 200;

  return {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      res.statusCode = statusCode;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(payload));
    },
  };
}

function localApiPlugin(): Plugin {
  return {
    name: "local-api-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "/", "http://localhost");
        const apiReq = req as any;

        if (!url.pathname.startsWith("/api/")) {
          next();
          return;
        }

        try {
          apiReq.body = await readJsonBody(req);
          apiReq.query = Object.fromEntries(url.searchParams.entries());
          const apiRes = createDevApiResponse(res);

          if (url.pathname === "/api/auth") {
            await authHandler(apiReq, apiRes);
            return;
          }

          if (url.pathname === "/api/db") {
            await dbHandler(apiReq, apiRes);
            return;
          }

          if (url.pathname === "/api/health") {
            await healthHandler(apiReq, apiRes);
            return;
          }

          if (url.pathname === "/api/upload") {
            await uploadHandler(apiReq, apiRes);
            return;
          }

          const functionMatch = url.pathname.match(/^\/api\/functions\/([^/]+)$/);
          if (functionMatch) {
            apiReq.query.name = functionMatch[1];
            await functionHandler(apiReq, apiRes);
            return;
          }

          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: { message: "API route not found" } }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: {
                message:
                  error instanceof Error ? error.message : "API request failed",
              },
            }),
          );
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      localApiPlugin(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
  };
});
