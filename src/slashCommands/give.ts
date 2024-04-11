import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";
import { getUser, createUser, addToWallet, removeFromWallet } from "../utility/database";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("give")
        .addUserOption((option) => {
            return option
                .setName("target")
                .setDescription("The person you want to give YunBucks to")
                .setRequired(true);
        })
        .addIntegerOption((option) => {
            return option
                .setName("amount")
                .setDescription("The amount of YunBucks you want to give to the person")
                .setRequired(true);
        })
        .setDescription("Give another user YunBucks :3"),
    execute: async (interaction) => {
        const userID = interaction.user.id;
        const user = await getUser(userID);
        const targetExists = interaction.options.getUser("target");
        const amount = interaction.options.getInteger("amount");

        if (!targetExists)
            return interaction.reply("You gotta tell me who you're giving YunBucks to :sob:");
        if (!amount)
            return interaction.reply("You have to specify an amount you're giving to someone");

        const target = await getUser(targetExists.id);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to give people YunBucks :sob:.\nIt's ok, I will make one for you <3"
            );
        }

        // Target has not tried any economy
        if (!target)
            return interaction.reply(
                `${targetExists} hasn't even opened up a bank account in 'Yun Banks™' yet and you're trying to give **YunBucks** to them :sob:`
            );

        if (amount <= 0)
            return interaction.reply("Silly!!! You have to input positive whole numbers!!");

        if (user.wallet < amount)
            return interaction.reply(
                "You can't have enough YunBucks in your wallet to give to the person :3"
            );

        removeFromWallet(userID, amount);
        addToWallet(targetExists.id, amount);
        return interaction.reply(`You gave ${targetExists}, ¥${amount} **YunBucks**!`);
    },
    cooldown: 20,
};

export default command;
