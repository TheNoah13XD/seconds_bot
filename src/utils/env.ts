import { config } from "dotenv";
import { resolve } from "path";

const MODE = process.env.NODE_ENV === "development"
  	? ".env.local"
  	: ".env";

const EnvPath = resolve(process.cwd(), MODE);

config({ path: EnvPath });

export const getEnvVar = (name: string, fallback?: string): string => {
	const value = process.env[name] ?? fallback;
	if (value === undefined) {
		throw new Error(`Missing environment variable: ${name}`);
	}

	return value;
}
