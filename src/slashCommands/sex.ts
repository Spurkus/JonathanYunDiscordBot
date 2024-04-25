import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getSex, createSex } from "../utility/database";
import { capitalisedName } from "../utility/functions";

const formatName = (name: string): string => {
    if (name[name.length - 1] == "s") {
        return capitalisedName(name) + "' Epic Sex";
    }
    return capitalisedName(name) + "'s Epic Sex";
};

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("sex")
        .addUserOption((option) => {
            return option.setName("target").setDescription("The person's sex").setRequired(false);
        })
        .setDescription("Check user's sex"),
    execute: async (interaction) => {
        await interaction.deferReply();
        let userID = interaction.user.id;
        let targetUser = interaction.options.getUser("target");

        if (targetUser) {
            userID = targetUser.id;
        }
        const user = await getSex(userID);
        const streak = user ? user.streak : 0;
        const total = user ? user.total : 0;

        if (!user) {
            if (targetUser) return interaction.editReply("This person hasn't even sex yet!!");
            createSex(userID);
        }

        const embed = new EmbedBuilder()
            .setTitle(
                `**${formatName(targetUser ? targetUser.username : interaction.user.username)}**`
            )
            .setDescription(`**Streak:** ${streak}\n**Total:** ${total}`)
            .setColor("Red")
            .setThumbnail(
                targetUser ? targetUser.displayAvatarURL() : interaction.user.displayAvatarURL()
            );

        await interaction.editReply({
            embeds: [embed],
        });
    },
    cooldown: 5,
};

export default command;
