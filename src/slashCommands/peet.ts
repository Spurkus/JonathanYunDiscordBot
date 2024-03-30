import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, AttachmentBuilder } from "discord.js"
import { imageFinder } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("peet")
    .setDescription("50/50 chance of getting pets or feet pics")
    ,
    execute: async interaction => {
        const petfeet = Math.random() < 0.5;

        const description = petfeet ? "awwww cute pet" : "*mmmmmmmmmmmmm* feet is so hot *slurp slurp slurrrrp* yum yummyy";
        const title = petfeet ? "Cute pets" : "hot feet :hot_face: :hot_face:";
        const {image, attach} = petfeet ? imageFinder("pet") : imageFinder("feet");

        const embed = new EmbedBuilder()
        .setDescription(description)
        .setTitle(title)
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