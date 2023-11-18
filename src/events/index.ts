import { Event } from "../utils/events.js";
import ready from "./ready.js";
import message from "./message.js";
import interaction from "./interaction.js";
import guildCreate from "./guildCreate.js";

export default [
    ready,
    message,
    interaction,
    guildCreate,
] as Event[];
