import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({});
  }),

  getUserList: privateProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findFirst({
      where: {
        userId: ctx.userId,
      },
      select: {
        watchList: true
      }
    });
  }),

  saveProduct: privateProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.upsert({
        where: {
          userId: ctx.userId,
        },
        update: {
          watchList: {
            connect: {
              id: input.productId,
            },
          },
        },
        create: {
          userId: ctx.userId,
          watchList: {
            connect: {
              id: input.productId,
            }
          }
        }
      });
    }),

  removeProduct: privateProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.prisma.user.findFirst({
        where: {
          userId: ctx.userId,
        },
      });

      if (!userExists) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      };

      return await ctx.prisma.user.update({
        where: {
          userId: ctx.userId,
        },
        data: {
          watchList: {
            disconnect: {
              id: input.productId,
            },
          },
        },
      });
    }),


});
