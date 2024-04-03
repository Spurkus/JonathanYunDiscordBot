import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../utility/types";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lmaooo he doesn't help you")
    ,
    execute: async interaction => {
        const emoji = await getEmoji(interaction.client);
        interaction.reply({
            content: `bro idk how to help you ${emoji.jonathan}`
        })
    },
    cooldown: 5
}

export default command