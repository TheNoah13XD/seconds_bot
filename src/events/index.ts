import { Event } from "../utils/events.js";
import ready from "./ready.js";
import message from "./message.js";

export default [
    ready,
    message,
] as Event[];