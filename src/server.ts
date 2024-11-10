import fastify from 'fastify';
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { registerUser } from "./routes/register-user";

import { env } from "./env/env";
import { authenticateWithPassword } from './routes/auth-user';
import { createTestimony } from './routes/create-testimony';
import { getTestimony } from './routes/get-testimony';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(registerUser);
app.register(authenticateWithPassword);

app.register(createTestimony);
app.register(getTestimony);

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP Server listening port: ${env.PORT} `);
});
