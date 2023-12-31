import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({});
  }),

  getFromSeries: publicProcedure
    .input(
      z.object({
        seriesId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.findMany({
        where: {
          seriesId: input.seriesId
        }
      })
    }),

  getPopular: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      take: 5,
      orderBy: {
        savedBy: {
          _count: 'desc'
        }
      }
    });
  })
});
