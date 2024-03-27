import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lmaooo he doesn't help you")
    ,
    execute: interaction => {
        interaction.reply({
            content: "bro idk how to help you <:Jonathan:1217063765518848011>"
        })
    },
    cooldown: 5
}

export default command