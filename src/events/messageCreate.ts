import { ChannelType, Message } from "discord.js";
import { BotEvent } from "../utility/types";
import mongoose from "mongoose";
import {
    addStreak,
    addTotal,
    createSex,
    getSex,
    resetStreak,
    setDate,
    getUser,
    createUser,
    addToWallet,
} from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        const emoji = await getEmoji(message.client);
        if (!message.member || message.member.user.bot) return;
        if (!message.guild) return;
        if (message.channel.type !== ChannelType.GuildText) return;
        if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");

        const date = new Date();
        const userID = message.author.id;
        const sex = await getSex(userID);

        // Sex Daily
        if (message.content.toUpperCase().includes("SEX")) {
            if (!sex) {
                message.reply(`OMG its your first sex!!! ${emoji.jonathan}`);
                createSex(userID);
            } else {
                addTotal(userID);
                const previousDate = new Date(sex.date);
                previousDate.setHours(0, 0, 0, 0); // So its midnight
                const nowDate = new Date();
                nowDate.setHours(0, 0, 0, 0);

                const difference =
                    (nowDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
                if (difference == 1) {
                    setDate(userID);
                    addStreak(userID);
                    const amount = (sex.streak + 1) * 100;

                    let user = await getUser(userID);
                    if (!user) {
                        user = await createUser(userID);
                    }

                    addToWallet(userID, amount);
                    message.reply(
                        `${message.author}, first **sex** of the day!!!! ${emoji.jonathan}\nEpic sex streak of: ${sex.streak + 1}\n**Jonathan Yun** has given you an extra ¥${addCommas(amount)} **YunBucks** in your wallet <3`
                    );
                } else if (difference > 1) {
                    setDate(userID);
                    resetStreak(userID);
                    message.reply(
                        `${message.author}, chat this is so sad :( ${emoji.jonathan}\nYou lost the sex streaks :pensive:, now its just: 1`
                    );
                }
            }
        }
    },
};

export default event;
