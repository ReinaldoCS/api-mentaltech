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
            content: z.string()
          }),
          response: {
            201: z.object({
              testimonyId: z.string()
            })
          }
        },
      },
      async (request, reply) => {
        const { content } = request.body;
        const sub = await request.getCurrentUserId();

        const testimony = await prisma.testimony.create({
          data: {
            content,
            User: {
              connect: {
                id: sub,
              },
            }
          }
        })

        return reply.status(201).send({ testimonyId: testimony.id });
      }
    );
}
