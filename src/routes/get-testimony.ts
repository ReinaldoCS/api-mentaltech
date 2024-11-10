import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "../middleware/auth";
import { z } from "zod";
import { prisma } from "../libs/prisma";

export async function getTestimony(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/testimony",
      {
        schema: {
          tags: ["testimony"],
          summary: "List all user testimony",
          security: [{ bearerAuth: [] }],
          response: {
            201: z.object({
              testimonies: z.array(
                z.object({
                  content: z.string(),
                  createdAt: z.date(),
                  id: z.string(),
                  authorId: z.string(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const sub = await request.getCurrentUserId();

        const testimonies = await prisma.testimony.findMany({
          where: {
            User: {
              id: sub,
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return reply.status(201).send({ testimonies });
      }
    );
}
