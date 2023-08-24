import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const seriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const seriesList = await ctx.prisma.series.findMany();
    for (const series of seriesList) {
      series.title = series.title.replace(/_/g, " ");
    };

    return seriesList;
  }),

});
