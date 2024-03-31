import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, SelectMenuOptionBuilder } from "discord.js"
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("say")
    .setDescription("What Jonathan Yun should say fr!!")
    ,
    execute: async interaction => {
        const modal = new ModalBuilder()
            .setCustomId("say")
            .setTitle("Jonathan Yun Message:")

		const messageInput = new TextInputBuilder()
			.setCustomId("message")
			.setLabel("What do you want Jonathan Yun to say?")
			.setStyle(TextInputStyle.Paragraph);

		const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);

		modal.addComponents(secondActionRow);

		await interaction.showModal(modal);
    },

    modal: async interaction => {
        await interaction.deferReply({ ephemeral: true });
        const message = interaction.fields.getTextInputValue("message");

        // Send the message to the same channel
        await interaction.channel?.send(message);

        return interaction.editReply({ content: "Message sent successfully!" });
    },
    cooldown: 5
}

export default command