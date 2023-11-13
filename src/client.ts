import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./utils/index.js";
import { db } from "../prisma/index.js";
import Events from "./events/index.js";
import Keys from "./keys.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

async function main() {
    await db.$connect();
    console.log("Connected to database");
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (err) => {
        console.log(err.message);
        await db.$disconnect();
        process.exit(1);
    });

registerEvents(client, Events);

client.login(Keys.clientToken)
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });