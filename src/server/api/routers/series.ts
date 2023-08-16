import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const seriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.series.findMany({});
  }),

});
