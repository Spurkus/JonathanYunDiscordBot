import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's ping")
    ,
    execute: interaction => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "Jonathan Yun"})
                .setDescription(`🏓 Pong! \n 📡 Ping: ${interaction.client.ws.ping}`)
                .setThumbnail(interaction.client.user?.avatarURL() || null)
                .setColor(getThemeColor("text"))
            ]
        })
    },
    cooldown: 10
}

export default command