import { Hono } from "hono/mod.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const apiRouter = new Hono();

apiRouter.get(
  "/random",
  zValidator(
    "query",
    z.object({
      mb: z.string()
        .default("1")
        .transform((value) => parseInt(value))
        .pipe(z.number().positive().lte(1024)),
    }),
  ),
  (ctx) => {
    const { mb } = ctx.req.valid("query");

    const maxBytes = mb * 1024;
    let byteCount = 0;

    const buffer = new Uint8Array(64 * 1024);

    return ctx.body(ReadableStream.from(
      async function* () {
        while (byteCount < maxBytes) {
          crypto.getRandomValues(buffer);
          byteCount += 64;
          yield buffer;
        }
      }(),
    ));
  },
);
