import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	throw new Error(`Invalid environment variables: ${z.prettifyError(parsedEnv.error)}`);
}

export const env = parsedEnv.data;