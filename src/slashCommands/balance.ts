import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getUser, createUser } from "../utility/database";
import { capitalisedName, addCommas } from "../utility/functions";

const formatName = (name: string): string => {
    if (name[name.length - 1] == "s") {
        return capitalisedName(name) + "' Yun Buck Balance";
    }
    return capitalisedName(name) + "'s Yun Buck Balance";
};

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("balance")
        .addUserOption((option) => {
            return option
                .setName("target")
                .setDescription("The person's YunBuck balance")
                .setRequired(false);
        })
        .setDescription("Check user's YunBuck balance"),
    execute: async (interaction) => {
        let userID = interaction.user.id;
        let targetUser = interaction.options.getUser("target");
        let message;

        if (targetUser) {
            userID = targetUser.id;
        }
        const user = await getUser(userID);
        const wallet = user ? user.wallet : 0;
        const bank = user ? user.bank : 500;

        if (!user) {
            if (targetUser)
                return interaction.reply(
                    "This person hasn't even made a bank account in 'Yun Banks™' yet, trying to access their balance you're so silly billy"
                );
            message =
                "You have not made a bank account in 'Yun Banks™' yet, I will make one for you <3";
            createUser(userID);
        }

        const embed = new EmbedBuilder()
            .setTitle(
                `**${formatName(targetUser ? targetUser.username : interaction.user.username)}**`
            )
            .setDescription(`**Wallet:** ¥${addCommas(wallet)}\n**Bank:** ¥${addCommas(bank)}`)
            .setColor("Green")
            .setThumbnail(
                targetUser ? targetUser.displayAvatarURL() : interaction.user.displayAvatarURL()
            )
            .setFooter({ text: "Yun Banks™" });

        await interaction.reply({
            content: message,
            embeds: [embed],
        });
    },
    cooldown: 5,
};

export default command;
