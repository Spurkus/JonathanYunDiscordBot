import { SlashCommandBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { getUser, createUser, addToWallet, removeFromWallet } from "../database";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("rob")
    .addUserOption(option => {
      return option
        .setName("target")
        .setDescription("The person you want to steal from >:)")
        .setRequired(true)
    })
    .setDescription("Robs an innocent user probably. You need at least ¥5000 YunBucks in your wallet")
    ,
    execute: async interaction => {
        const userID = interaction.user.id;
        const user = await getUser(userID);
        const targetExists = interaction.options.getUser("target");

        if (!targetExists) return interaction.reply("You gotta tell me who you're stealing from :sob:");

        const target = await getUser(targetExists.id);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already trying to rob smh.\nIt's ok, I will make one for you <3");
        }

        // Target has not tried any economy
        if (!target) return interaction.reply(`${targetExists} hasn't even opened up a bank account in 'Yun Banks™' yet and you're trying to rob them :sob:, so impatient smh smh`);

        if (user.wallet < 5000) return interaction.reply(`You need at least ¥5000 **YunBucks** in your wallet to steal from ${targetExists}`);

        if (target.wallet < 500) return interaction.reply(`${targetExists} BARELY has any **YunBucks**. Why are you trying to steal from them, just let them be lmao`);

        const randomChance = Math.floor(Math.random() * 100);
        if (randomChance >= 40){
          const stolen = Math.floor(Math.random() * target.wallet);
          addToWallet(userID, stolen);
          removeFromWallet(targetExists.id, stolen);
          return interaction.reply(`You stole ¥${stolen} **YunBucks** from ${targetExists}, you sneaky little baka >.<`);
        } else {
          removeFromWallet(userID, 5000);
          return interaction.reply(`You were caught trying to steal from ${targetExists}. The police are not daijobu at all an fined you ¥5000 **YunBucks**`);
        }

    },
    cooldown: 20
}

export default command