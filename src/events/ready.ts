import { Client } from "discord.js";
import { BotEvent } from "../utility/types";
import { color } from "../utility/functions";

const event: BotEvent = {
    name: "ready",
    once: true,
    execute: (client: Client) => {
        console.log(
            color(
                "text",
                `😎 Jonathan Yun has been activated as ${color("variable", client.user?.tag)}`
            )
        );
    },
};

export default event;
