import { seriesRouter } from "~/server/api/routers/series";
import { productsRouter } from "./routers/products";
import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  series: seriesRouter,
  products: productsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
