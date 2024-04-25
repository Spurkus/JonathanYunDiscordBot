import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName("porn").setDescription("O///O"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const pornImage = "https://i.imgur.com/E7fHQGR.png";
        interaction.editReply({
            content: `||${pornImage}$||`,
        });
    },
    cooldown: 5,
};

export default command;
