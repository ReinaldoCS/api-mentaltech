import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import bcryptjs from 'bcryptjs'
import { z } from "zod";
import { prisma } from "../libs/prisma";

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user",
    {
      schema: {
        tags: ["auth"],
        summary: "Register a new user",
        body: z.object({
          nome: z.string(),
          sobrenome: z.string(),
          email: z.string(),
          senha: z.string(),
          confirmarSenha: z.string(),
          telefone: z.string(),
          data_nascimento: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const {
        nome,
        sobrenome,
        email,
        senha,
        confirmarSenha,
        telefone,
        data_nascimento,
      } = request.body;

      if (senha !== confirmarSenha) {
        return reply.status(400).send({ message: "Senhas não conferem." });
      }

      const usuarioJaExiste = await prisma.users.findUnique({
        where: { email },
      });

      if (usuarioJaExiste) {
        return reply.status(400).send({ message: "Email já cadastrado." });
      }

      const passwordHash = await bcryptjs.hash(senha, 6)

      await prisma.users.create({
        data: {
          firstMame: nome,
          lastName: sobrenome,
          cellphone: telefone,
          dateOfBirth: new Date(data_nascimento),
          passwordHash,
          email,
        },
      });

      return reply.send({ message: "Usuário registrado com sucesso!" });
    }
  );
}
