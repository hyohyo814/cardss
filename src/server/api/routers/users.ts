import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({});
  }),

  getUserList: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        watchList: true,
      },
    });
  }),

  addUser: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;
    return await ctx.prisma.user.create({
      data: {
        userId: userId,
      },
    });
  }),

  saveProduct: privateProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { productId } = input;
      return await ctx.prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          watchList: {
            connect: {
              id: productId,
            },
          },
        },
      });
    }),
  
  removeProduct: privateProcedure
  .input(z.object({ productId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { productId } = input;
    return await ctx.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        watchList: {
          disconnect: {
            id: productId,
          },
        },
      },
    });
  }),

  
});
