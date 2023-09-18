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
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          _="
          on click
            toggle @disabled on me
            fetch /api/random?mb=100 as response then
              set :startTime to performance.now()
              set reader to result.body.getReader()
              repeat forever
                set result to reader.read()
                if result.done break  
                else
                  increment :bytes by result.value.length
                  set kbytes to :bytes / ((performance.now() - :startTime) / 1000) / 1024 / 1024
                  put `${kbytes.toFixed(2)} MB/s` into #content
                end
              end
              toggle @disabled on me"
        >
          Test
        </button>
        <div id="content" />
      </div>
    </Page>,
  ));

app.get("*", serveStatic({ root: "./static/" }));
Deno.serve(app.fetch);
