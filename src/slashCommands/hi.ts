import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName("hi").setDescription("Says hi if you say hi :3"),
    execute: async (interaction) => {
        const emoji = await getEmoji(interaction.client);
        await interaction.reply({
            content: `Hello ${interaction.member}, I am Jonathan Yun! ${emoji.jonathan}`,
        });
    },
    cooldown: 5,
};

export default command;
