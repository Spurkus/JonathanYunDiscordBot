import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("sex")
        .setDescription("What is your favourite sex?")
    ,
    execute: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId("sex")
            .setTitle("What is your favourite?")

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('sexInput')
			.setLabel("What's some of your favourite sex?")
			.setStyle(TextInputStyle.Paragraph);

		const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);

		modal.addComponents(secondActionRow);

		await interaction.showModal(modal);
    },

    modal: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        
        const hobbies = interaction.fields.getTextInputValue('sexInput');

        await interaction.editReply({ content: `So, your sex is ${hobbies}! <:Jonathan:1217063765518848011>` });
    },
    cooldown: 5
}

export default command