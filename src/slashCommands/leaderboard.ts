import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { calculateNetWorth, getTopUsers } from "../economy";
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
    .setDescription("Check top 10 YunBuck networth in server")
    ,
    execute: async interaction => {
        // Retrieve the top 10 users by net worth who are members of the server
        if (!interaction.guild?.members) {
            return interaction.reply("You need to be in a server to use this silly!!!");
        }

        const topUsers = await getTopUsers(interaction.guild.members.fetch(), 10);

        const embed = new EmbedBuilder()
            .setTitle("**Yun Bucks** Leaderboard Net Worth!!!")
            .setColor("Green");

        // Add each user to the embed
        const promises = topUsers.map(async (user, index) => ({
            name: `${createName(`${index + 1}. ${await getName(interaction.guild, user.userId)}`)}`,
            value: `Net Worth: ¥${calculateNetWorth(user)}`,
        }));

        embed.addFields(await Promise.all(promises));
        return interaction.reply({ embeds: [embed] });
    },
    cooldown: 5
}

export default command