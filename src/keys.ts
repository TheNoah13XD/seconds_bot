import { getEnvVar } from "./utils/env.js";

export const Keys = {
    clientToken: getEnvVar("CLIENT_TOKEN"),
    clientId: getEnvVar("CLIENT_ID"),
    botId: getEnvVar("BOT_ID"),
} as const;

export default Keys;