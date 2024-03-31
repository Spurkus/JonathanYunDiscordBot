import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { IUser, ISex, SlashCommand } from "../types";
import { calculateNetWorth, getTopUsers, getTopSex, getTopSexStreak } from "../database";
import { capitalisedName } from "../functions";

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

        let topUsers: (IUser | ISex)[];
        let topStreak;
        let promises;

        if (yun) {
            topUsers = await getTopUsers(interaction.guild.members.fetch(), 10);
        } else {
            topUsers = await getTopSex(interaction.guild.members.fetch(), 10);
        }

        const embed = new EmbedBuilder()
            .setTitle(`${yun ? "**Yun Bucks** Leaderboard Net Worth!!!" : "Sex leaderboard :smiling_imp:"}`)
            .setColor(`${yun ? "Green" : "Red"}`);

        promises = topUsers.map(async (user, index) => ({
            name: `${createName(`${index + 1}. ${await getName(interaction.guild, user.userId)}`)}`,
            value: `${yun ? "Net Worth: ¥" : "Total Sex: "}${yun ? calculateNetWorth(user as IUser) : (user as ISex).total}`,
        }));

        if (yun) {
            embed.addFields(await Promise.all(promises));
        } else {
            topStreak = await getTopSexStreak(interaction.guild.members.fetch(), 10);
            const highestStreaks = topStreak.map(async (user, index) => ({
                name: `${createName(`${index + 1}. ${await getName(interaction.guild, user.userId)}`)}`,
                value: `Current Streak: ${user.streak}`
            }));

            embed.addFields(
                { name: "\u200B", value: "**Total Sex**" },
                ...(await Promise.all(promises)),
                { name: "\u200B", value: "**Highest Sex Streak!!**" },
                ...(await Promise.all(highestStreaks))
            );
        }
        return interaction.reply({ embeds: [embed] });
    },
    cooldown: 5
}

export default command