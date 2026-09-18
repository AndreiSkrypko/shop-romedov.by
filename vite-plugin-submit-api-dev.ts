import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

import { handleSubmitLeadPost } from "./src/lib/submit-lead-handler.server";

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? "localhost";
  const url = `http://${host}${req.url ?? "/"}`;
  const method = req.method ?? "GET";
  const body =
    method === "GET" || method === "HEAD" ? undefined : await readBody(req);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const part of value) headers.append(key, part);
    } else {
      headers.set(key, value);
    }
  }

  return new Request(url, { method, headers, body });
}

async function writeWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}

/** В vite dev server.ts не перехватывает /api/submit.php — отдаём тот же обработчик, что на Hoster. */
export function submitApiDevPlugin(): Plugin {
  return {
    name: "romedov-submit-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        if (pathname !== "/api/submit.php") {
          next();
          return;
        }

        try {
          const request = await toWebRequest(req);
          const response = await handleSubmitLeadPost(request);
          await writeWebResponse(res, response);
        } catch (error) {
          console.error("[submit-api-dev]", error);
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify({
              ok: false,
              error: "Не удалось отправить. Попробуйте позже или позвоните нам.",
            }),
          );
        }
      });
    },
  };
}
