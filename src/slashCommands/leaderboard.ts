import { SlashCommandBuilder, EmbedBuilder, Embed, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageComponentInteraction } from "discord.js"
import { SlashCommand } from "../types";
import { calculateNetWorth, getTopUsers, getTopSex, getTopSexStreak } from "../database";
import { capitalisedName } from "../functions";

type Position = Promise<{ name: string; value: string; }>[]
interface DisplayResult {
    embed: EmbedBuilder;
    row: ActionRowBuilder<ButtonBuilder>;
}

const getName = async (guild: any, userID: string): Promise<string> => {
    const member = await guild.members.fetch(userID);
    return capitalisedName(member.user.username);
};

const getTrophyEmoji = (index: number): string => {
    switch (index) {
        case 1:
            return ":first_place:";
        case 2:
            return ":second_place:";
        case 3:
            return ":third_place:";
        default:
            return "";
    }
}

const createName = (namePlacement: string): string => {
    return getTrophyEmoji(parseInt(namePlacement.charAt(0))) + namePlacement
}

const displayInteraction = async (promises: Position, highestStreaks: Position, total: boolean): Promise<DisplayResult> => {
    const totalSex = new ButtonBuilder()
        .setCustomId("totalSex")
        .setLabel("Total Sex")
        .setEmoji("💪")
        .setDisabled(total)
        .setStyle(ButtonStyle.Success);

    const streakSex = new ButtonBuilder()
        .setCustomId("streakSex")
        .setLabel("Streak Sex")
        .setEmoji("🔥")
        .setDisabled(!total)
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(totalSex, streakSex);

    if (total) {
        const embedTotal = new EmbedBuilder()
            .setTitle("Sex Leaderboard :smiling_imp:")
            .setColor("Red")
            .addFields(
            { name: "❤️❤️❤️❤️❤️❤️", value: "**Total Sex**" },
            ...(await Promise.all(promises)),
        );

        return {embed: embedTotal, row};
    } else {
        const embedStreak = new EmbedBuilder()
            .setTitle("Sex Leaderboard :smiling_imp:")
            .setColor("Red")
            .addFields(
            { name: "❤️❤️❤️❤️❤️❤️", value: "**Highest Sex Streak!!**" },
            ...(await Promise.all(highestStreaks))
        );
        return {embed: embedStreak, row};
    }
}

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("leaderboard")
    .addStringOption(option => {
      return option
        .setName("type")
        .setDescription("The type of leaderboard you want to see")
        .addChoices(
            { name: "YunBucks", value: "yunbucks" } ,
            { name: "Sex", value: "sex" }
        )
        .setRequired(true)
    })
    .setDescription("Check top 10 YunBuck networth or top 10 Sex in server")
    ,
    execute: async interaction => {
        if (!interaction.guild?.members) return interaction.reply("You need to be in a server to use this silly!!!");

        const type = interaction.options.getString("type");

        if (!type) return interaction.reply("You must select a leaderboard type :3")
        const yun = type == "yunbucks";

        if (yun) { // YunBucks Leaderboard
            const topUsers = await getTopUsers(interaction.guild.members.fetch(), 10);

            const promises = topUsers.map(async (user, index) => ({
                name: `${createName(`${index + 1}. ${await getName(interaction.guild, user.userId)}`)}`,
                value: `Net Worth: ¥${calculateNetWorth(user)}`
            }));

            const embed = new EmbedBuilder();

            embed.setTitle("**Yun Bucks** Leaderboard Net Worth!!!")
                 .setColor("Green")
                 .addFields(await Promise.all(promises))

            return await interaction.reply({ embeds: [embed] });
        } else { // Sex Leaderboard
            const topSex = await getTopSex(interaction.guild.members.fetch(), 10);
            const topStreak = await getTopSexStreak(interaction.guild.members.fetch(), 10);

            const promises = topSex.map(async (user, index) => ({
                name: `${createName(`${index + 1}. ${await getName(interaction.guild, user.userId)}`)}`,
                value: `Total Sex: ${user.total}`
            }));

            const highestStreaks = topStreak.map(async (user, index) => ({
                name: `${createName(`${index + 1}. ${await getName(interaction.guild, user.userId)}`)}`,
                value: `Current Streak: ${user.streak}`
            }));

            const {embed, row} = await displayInteraction(promises, highestStreaks, true);

            const response = await interaction.reply({ 
                embeds: [embed],
                components: [row],
            });

            const collectorFilter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

            // Listen for interactions on the buttons
            const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

            collector.on("collect", async (choice: MessageComponentInteraction) => {
                const { embed, row } = await displayInteraction(promises, highestStreaks, choice.customId === "totalSex");

                await choice.update({
                    embeds: [embed],
                    components: [row],
                });
            });

        }
    },
    cooldown: 5
}

export default command