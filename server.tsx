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
    <Page title="Speed Test">
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

                  set mb to :bytes / 1024 / 1024
                  set seconds to (performance.now() - :startTime) / 1000
                  set speed to mb / seconds

                  put `${mb.toFixed(2)} MB` into #mb
                  put `${seconds.toFixed(2)} seconds` into #seconds
                  put `${speed.toFixed(2)} MB/s` into #speed
                end
              end
              toggle @disabled on me"
        >
          Test
        </button>
        <div>
          <p id="mb" />
          <p id="seconds" />
          <p id="speed" />
        </div>
      </div>
    </Page>,
  ));

app.get("*", serveStatic({ root: "./static/" }));
Deno.serve({ hostname: "0.0.0.0", port: 8080 }, app.fetch);
