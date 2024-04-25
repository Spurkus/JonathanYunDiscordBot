import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getUser,
    createUser,
    addToWallet,
    removeFromWallet,
    removeEffect,
} from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("rob")
        .addUserOption((option) => {
            return option
                .setName("target")
                .setDescription("The person you want to steal from >:)")
                .setRequired(true);
        })
        .setDescription(
            "Robs an innocent user probably. You need at least ¥5,000 YunBucks in your wallet"
        ),
    execute: async (interaction) => {
        await interaction.deferReply();
        const emoji = await getEmoji(interaction.client);
        const userID = interaction.user.id;
        const user = await getUser(userID);
        const targetExists = interaction.options.getUser("target");

        if (!targetExists)
            return interaction.editReply("You gotta tell me who you're stealing from :sob:");

        const target = await getUser(targetExists.id);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.editReply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to rob smh.\nIt's ok, I will make one for you <3"
            );
        }

        // Target has not tried any economy
        if (!target)
            return interaction.editReply(
                `${targetExists} hasn't even opened up a bank account in 'Yun Banks™' yet and you're trying to rob them :sob:, so impatient smh smh`
            );

        if (user.wallet < 5000)
            return interaction.editReply(
                `You need at least ¥5,000 **YunBucks** in your wallet to steal from ${targetExists}`
            );

        if (target.wallet < 500)
            return interaction.editReply(
                `${targetExists} BARELY has any **YunBucks**. Why are you trying to steal from them, just let them be lmao`
            );

        const activeEffectIDs = target.active.map((effect) => effect[0]);
        if (activeEffectIDs.includes(1)) {
            // 1 is the effectID for Shield of Yun
            removeEffect(targetExists.id, 1, 1);
            removeFromWallet(userID, 1000);
            return interaction.editReply(
                `You have been cock BLOCKED!!!!!!! **Jonathan Yun** himself has take ¥1,000 from you.\n${targetExists} is safe because they have ${emoji.shieldyun} **Shield of Yun** activated :3`
            );
        }
        const randomChance = Math.floor(Math.random() * 100);
        if (randomChance >= 40) {
            const stolen = Math.floor(Math.random() * target.wallet);
            addToWallet(userID, stolen);
            removeFromWallet(targetExists.id, stolen);
            return interaction.editReply(
                `You stole ¥${addCommas(stolen)} **YunBucks** from ${targetExists}, you sneaky little baka >.<`
            );
        } else {
            removeFromWallet(userID, 5000);
            return interaction.editReply(
                `You were caught trying to steal from ${targetExists}. The police are not daijobu at all an fined you ¥5,000 **YunBucks**`
            );
        }
    },
    cooldown: 180,
};

export default command;
