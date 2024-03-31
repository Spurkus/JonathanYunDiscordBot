import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { imageFinder } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About me")
    ,
    execute: async interaction => {
        const {image, attach} = imageFinder("jonathan");

        const embed = new EmbedBuilder()
        .setDescription("Hi! I'm Jonathan Yun, and I'm awesome!!")
        .setTitle("About Me")
        .setAuthor({ name: 'Jonathan Yun', iconURL: `attachment://${image}` , url: 'https://jonathanyun.com' })
        .setColor(`Aqua`)
        .addFields(
            { name: 'Linkedin', value: '[Click here!](https://www.linkedin.com/in/thejonathanyun/)', inline : true },
            { name: 'Instagram', value: '[Click here!](https://www.instagram.com/mfw_jonathan/)', inline : true },
        )

        await interaction.reply({
            embeds: [embed],
            files: [attach]
        })
    },
    cooldown: 5
}

export default command