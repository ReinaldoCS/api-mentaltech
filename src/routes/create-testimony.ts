import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "../middleware/auth";
import { z } from "zod";
import { prisma } from "../libs/prisma";

export async function createTestimony(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/testimony",
      {
        schema: {
          tags: ["testimony"],
          summary: "Create a testimony",
          security: [{ bearerAuth: [] }],
          body: z.object({
            tasks: z.array(z.string())
          }),
          response: {
            201: z.null()
          }
        },
      },
      async (request, reply) => {
        const { tasks } = request.body;
        const sub = await request.getCurrentUserId();

      await prisma.testimony.createMany({
        data: tasks.map(task => ({
          content: task,
          authorId: sub
        })),
      })

        return reply.status(201).send();
      }
    );
}
