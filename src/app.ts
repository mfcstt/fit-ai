import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const app = Fastify();

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Fit AI API",
      description: "API for Fit AI application",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Local development server",
        url: "http://localhost:3000",
      },
    ],
  },
  transform: jsonSchemaTransform
})

await app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})