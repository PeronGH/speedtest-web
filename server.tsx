import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { serveStatic } from "hono/middleware.ts";
import { assetsRouter } from "$/routes/assets.ts";
import { apiRouter } from "$/routes/api.ts";

const app = new Hono();
app.route("/assets", assetsRouter);
app.route("/api", apiRouter);

app.get("/", (ctx) =>
  ctx.html(
    <Page title="Index Page">
      <div class="container mx-auto p-4">
        <button
          id="load-btn"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          hx-get="/load"
          hx-target="#content"
          hx-swap="outerHTML"
        >
          Load
        </button>
        <div id="content" />
      </div>
    </Page>,
  ));

app.get("*", serveStatic({ root: "./static/" }));
Deno.serve(app.fetch);
