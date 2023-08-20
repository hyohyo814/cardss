import { TRPCError } from "@trpc/server";
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
        userId: userId,
      },
      include: {
        watchList: true,
      },
    });
  }),

  saveProduct: privateProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { productId } = input;
      const userExist = await ctx.prisma.user.findFirst({
        where: {
          userId: userId,
        },
      });

      if (!userExist) {
        await ctx.prisma.user.create({
          data: {
            userId: userId,
          },
        });
      };

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
    const useExists = await ctx.prisma.user.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!userExist) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    };

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
