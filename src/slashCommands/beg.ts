import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getUser,
    createUser,
    removeFromWallet,
    addToWallet,
    removeEffect,
} from "../utility/database";
import { addCommas } from "../utility/functions";

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName("beg").setDescription("Beg for a few YunBucks"),
    execute: async (interaction) => {
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already begging smh.\nIt's ok, I will make one for you <3"
            );
        }

        const effectIDs = user.active.map((effect) => effect[0]);
        let messageActive: String = "";

        const luckActive = effectIDs.includes(3); // 3 is Luck effect
        const luckBonus = luckActive ? 1.08 : 1;
        if (luckActive) {
            removeEffect(userID, 3, 1);
            messageActive = ":four_leaf_clover: Luck of 8% bonus has been activated\n";
        }

        const randomChance = Math.floor(Math.random() * 100) * luckBonus; // Random :3

        // Receives Nothing
        if (randomChance <= 8) {
            return interaction.reply(
                `${messageActive}${interaction.member}, you begged and nobody likes you so received nothing LMAOO. ¥0 **YunBucks** was added`
            );
        }

        // Gets Robbed
        if (randomChance <= 15 && user.wallet > 200) {
            var randomNumber = Math.floor(Math.random() * 200) + 1;
            removeFromWallet(userID, randomNumber);
            return interaction.reply(
                `${messageActive}${interaction.member}, you begged and someone hates you so they decided to rob you L. ¥${randomNumber} **YunBucks** was taken from your wallet`
            );
        }

        // Begging worked!
        var randomNumber = Math.floor(Math.random() * 500 * luckBonus) + 1;
        addToWallet(userID, randomNumber);
        return interaction.reply(
            `${messageActive}${interaction.member}, you begged and received ¥${addCommas(randomNumber)} **YunBucks**.`
        );
    },
    cooldown: 10,
};

export default command;
