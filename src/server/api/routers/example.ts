import axios, { AxiosResponse } from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  scrape: publicProcedure
  .input(z.object({
    text: z.string().url()
  })).query(async ({ input }) => {
    const response = await axios.get(input.text, {
      responseType: "text",
      validateStatus: null,
    })

    return response.data as string;
  })
});
