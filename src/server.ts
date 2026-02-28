import Fastify from "fastify";
import { env } from "./env";

export const app = Fastify();

app.listen(
  {
    port: env.PORT,
  },
  () => console.log(`Server is running on http://localhost:${env.PORT}`),
);
