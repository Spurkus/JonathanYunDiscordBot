import { ChannelType, Message } from "discord.js";
import { checkPermissions, getDateString, getGuildOption, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";
import { addStreak, addTotal, createSex, getSex, resetStreak, setDate } from "../database";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        if (!message.member || message.member.user.bot) return;
        if (!message.guild) return;
        if (message.channel.type !== ChannelType.GuildText) return;
        if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")

        const date = new Date();
        const userID = message.author.id;
        const sex = await getSex(userID);

        // Sex Daily
        if (message.content.toUpperCase().includes("SEX")) {
            if (!sex) {
                message.reply("OMG its your first sex!!! <:Jonathan:1217063765518848011>");
                createSex(userID);
            } else if (sex.date.getFullYear() == date.getFullYear() && sex.date.getMonth() == date.getMonth() && sex.date.getDate() == date.getDate()) {
                addTotal(userID);
            } else if (sex.date.getFullYear() == date.getFullYear() && sex.date.getMonth() == date.getMonth() && sex.date.getDate() + 1 == date.getDate()) {
                setDate(userID);
                addStreak(userID);
                addTotal(userID);
                message.reply(`${message.author}, first **sex** of the day!!!! <:Jonathan:1217063765518848011>\nEpic sex streak of: ${sex.streak + 1}`);
            } else {
                resetStreak(userID);
                addTotal(userID);
                message.reply(`${message.author}, chat this is so sad :( <:Jonathan:1217063765518848011>\nYou lost the sex streaks :pensive:, now its just: ${sex.streak}`);
            }
        }

    }
}

export default event