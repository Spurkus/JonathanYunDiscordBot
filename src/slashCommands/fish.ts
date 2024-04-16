import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getUser, createUser, removeEffect, addToInventory } from "../utility/database";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("fish")
        .setDescription("Fish with a fishing rod for a few YunBucks"),
    execute: async (interaction) => {
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to fish smh.\nIt's ok, I will make one for you <3"
            );
        }

        // User does not have fishing rod in inventory
        const hasRod = user.inventory.find((userItem) => userItem[0] === 4); // 4 is the fishing rod ID
        if (!hasRod)
            return interaction.reply(
                `You don't even have a 🎣 **Fishing Rod** in your inventory XD`
            );

        const effectIDs = user.active.map((effect) => effect[0]);
        let messageActive: String = "";

        const luckActive = effectIDs.includes(3); // 3 is Luck effect
        const luckBonus = luckActive ? 1.08 : 1;
        if (luckActive) {
            removeEffect(userID, 3, 1);
            messageActive = ":four_leaf_clover: Luck of 8% bonus has been activated\n";
        }

        const randomChance = Math.floor(Math.random() * 100) * luckBonus; // Random :3

        // Fishes nothing
        if (randomChance <= 8) {
            return interaction.reply(
                `${messageActive}${interaction.member}, you fished and the fishes hate you so nothing came up.`
            );
        }

        // Gets old boot
        if (randomChance <= 15) {
            addToInventory(userID, 6, 1);
            return interaction.reply(
                `${messageActive}${interaction.member}, you fished and hooked onto something!!! Unfortunately it was an old boot XD.\nYou received 1 🥾 **Old Boot**.`
            );
        }

        // Fishing Success!!
        const fishAmount = Math.floor(Math.random() * 5 * luckBonus); // Random :3
        addToInventory(userID, 5, fishAmount);
        return interaction.reply(
            `${messageActive}${interaction.member}, you successfully fished up ${fishAmount} 🐟 **Fish**!!`
        );
    },
    cooldown: 10,
};

export default command;
