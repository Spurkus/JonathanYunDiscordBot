import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("hi")
    .setDescription("Says hi if you say hi :3")
    ,
    execute: interaction => {
        interaction.reply({
            content: `Hello ${interaction.member}, I am Jonathan Yun! <:Jonathan:1217063765518848011>`
        })
    },
    cooldown: 5
}

export default command