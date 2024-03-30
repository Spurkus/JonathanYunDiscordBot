import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, AttachmentBuilder } from "discord.js"
import { imageFinder } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("duck")
    .setDescription("Gives you a randomised cute duck photo yay :33")
    ,
    execute: async interaction => {
        const {image, attach} = imageFinder("duck");

        const embed = new EmbedBuilder()
        .setDescription("awwwww cute duck")
        .setTitle("Cute ducks")
        .setImage(`attachment://${image}`)
        .setColor(`Aqua`)

        await interaction.reply({
            embeds: [embed],
            files: [attach]
        })
    },
    cooldown: 5
}

export default command