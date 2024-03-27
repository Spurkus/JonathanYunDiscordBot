import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("porn")
    .setDescription("O///O")
    ,
    execute: interaction => {
        const pornImage = ('https://i.imgur.com/E7fHQGR.png')
        interaction.reply({
            content: `||${pornImage}$||`
        })
    },
    cooldown: 5
}

export default command