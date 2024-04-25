import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName("hi").setDescription("Says hi if you say hi :3"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const emoji = await getEmoji(interaction.client);
        return await interaction.editReply({
            content: `Hello ${interaction.member}, I am Jonathan Yun! ${emoji.jonathan}`,
        });
    },
    cooldown: 5,
};

export default command;
