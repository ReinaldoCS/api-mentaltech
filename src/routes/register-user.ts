import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
 
export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user",
    {
      schema: {
        tags: ['auth'],
        summary: "Register a new user",
        body: z.object({
          nome: z.string(),
          sobrenome: z.string(),
          email: z.string(),
          senha: z.string(),
          confirmarSenha: z.string(),
          telefone: z.string(),
          data_nascimento: z.string(),
        })
      }
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

      

      reply.send({ message: "User registered successfully" });
    }
  );
}
