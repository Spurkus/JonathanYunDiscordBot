import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getUser, createUser, getEffect } from "../utility/database";
import { capitalisedName } from "../utility/functions";
import getEmoji from "../utility/emoji";

const formatName = (name: string): string => {
    if (name[name.length - 1] == "s") {
        return capitalisedName(name) + "' Active Effects";
    }
    return capitalisedName(name) + "'s Active Effects";
};

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("effects")
        .setDescription("Shows your active effects :3"),
    execute: async (interaction) => {
        const emoji = await getEmoji(interaction.client);

        const userID = interaction.user.id;
        const user = await getUser(userID);
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to see the effects you never had :sob:.\nIt's ok, I will make one for you <3"
            );
        }

        const effects = user.active;

        const itemDisplay = effects.map(async (effect) => {
            const fetchedEffect = await getEffect(effect[0]);
            if (!fetchedEffect) throw new Error(`Item with ID ${effect[0]} not found.`);

            return {
                name: `${emoji[fetchedEffect.emoji]} **${fetchedEffect.name}** (${effect[1]})`,
                value: fetchedEffect.description,
            };
        });

        const embed = new EmbedBuilder()
            .setTitle(`${formatName(interaction.user.username)}`)
            .setDescription("Effects have limited amounts of uses!!")
            .setColor("Fuchsia")
            .setFields(...(await Promise.all(itemDisplay)))
            .setFooter({ text: "YunEffects™" });

        await interaction.reply({
            embeds: [embed],
        });
    },
    cooldown: 5,
};

export default command;
