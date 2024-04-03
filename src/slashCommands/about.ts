import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../utility/types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Jonathan Yun's about me :33")
    ,
    execute: async interaction => {
        const embed = new EmbedBuilder()
        .setDescription("Hi! I'm Jonathan Yun, and I'm awesome!!")
        .setTitle("About Me")
        .setAuthor({ name: "Jonathan Yun", iconURL: "https://i.imgur.com/E7fHQGR.png" , url: 'https://jonathanyun.com' })
        .setThumbnail("https://i.imgur.com/E7fHQGR.png")
        .setColor(`Aqua`)
        .addFields(
            { name: 'Website', value: '[Click here!](https://www.jonathanyun.com/)', inline : true },
            { name: 'Linkedin', value: '[Click here!](https://www.linkedin.com/in/thejonathanyun/)', inline : true },
            { name: 'Instagram', value: '[Click here!](https://www.instagram.com/mfw_jonathan/)', inline : true },
            { name: 'Github', value: '[Click here!](https://github.com/Spurkus/JonathanYunDiscordBot/)', inline : true }
        )

        await interaction.reply({
            embeds: [embed],
        })
    },
    cooldown: 5
}

export default command