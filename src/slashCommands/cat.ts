import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, AttachmentBuilder } from "discord.js"
import { imageFinder } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("You get a randomised cute cat photo yayay!! but sometimes you get james corden cat o.o")
    ,
    execute: async interaction => {
        const {image, attach} = imageFinder("cat");

        const embed = new EmbedBuilder()
        .setDescription("awwwww cute cat")
        .setTitle("Cute cats")
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