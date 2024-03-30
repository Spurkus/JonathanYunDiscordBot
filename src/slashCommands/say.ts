import { SlashCommandBuilder, } from "discord.js"
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("say")
    .addStringOption(option => {
      return option
        .setName("message")
        .setDescription("Message that Jonathan Yun will say")
        .setRequired(true);
    })
    .setDescription("What Jonathan Yun should say fr!!")
    ,
    execute: async interaction => {
        try {
            await interaction.deferReply({ ephemeral: true });
            const message = interaction.options.getString("message");

            if (!message) {
                return interaction.editReply({ content: "Please provide a message." });
            }

            const formattedMessage = message.replace(/\\n/g, '\n');

            // Send the message to the same channel
            await interaction.channel?.send(formattedMessage);

            return interaction.editReply({ content: "Message sent successfully!" });
        } catch (error) {
            console.error("Error:", error);
            return interaction.editReply({ content: "Something went wrong..." });
        }
    },
    cooldown: 5
}

export default command