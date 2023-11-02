import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.create({
        data: {
          content: input.content,
          done: false,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.todo.findMany({
      orderBy: [{ done: "asc" }, { createdAt: "desc" }],
    });
  }),

  updateDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: !input.done,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
