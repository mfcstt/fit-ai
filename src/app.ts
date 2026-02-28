import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { jsonSchemaTransform, type ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "./lib/auth";
import fastifyCors from "@fastify/cors";
import fastifyApiReference from "@scalar/fastify-api-reference";

export const app = Fastify();

// Register Swagger/OpenAPI documentation
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

// Register Swagger UI
await app.register(fastifyApiReference, {
  routePrefix: "/docs",
  configuration: {
    sources: [
      {
        title: "Fit AI API",
        slug: "fit-ai-api",
        url: "/swagger.json",
      },
      {
        title: "Auth API",
        slug: "auth-api",
        url: "/api/auth/open-api/generate-schema",
      },
    ],
  },
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/swagger.json",
  schema: {
    hide: true,
  },
  handler: async () => {
    return app.swagger();
  },
});


// CORS configuration
await app.register(fastifyCors, {
  origin: ['http://localhost:5173'],
  credentials: true,
})

// Authentication endpoint (BetterAuth)
app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);
      
      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });
      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });
      // Process authentication request
      const response = await auth.handler(req);
      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      app.log.error
      reply.status(500).send({ 
        error: "Internal authentication error",
        code: "AUTH_FAILURE"
      });
    }
  }
});
