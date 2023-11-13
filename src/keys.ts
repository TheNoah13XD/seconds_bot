import { getEnvVar } from "./utils/env.js";

export const Keys = {
    clientToken: getEnvVar("CLIENT_TOKEN"),
    clientId: getEnvVar("CLIENT_ID"),
} as const;

export default Keys;