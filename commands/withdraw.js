module.exports = {
  name: "withdraw",
  aliases: ["wd", "with"],
  permissions: [],
  description: "Withdraw coins from your bank",
  async execute(client, message, args, Discord, profileData){
    const profileModel = require("../models/profileSchema");
    var amount = args[0];
    if(args[0] === "all") var amount = profileData.bank;
    if (amount % 1 != 0 || amount <= 0) return message.reply("Withdrawn amount must be a whole number you baka >.<");

    try {
      if (amount > profileData.bank) return message.reply(`You don't have that amount of YunBucks to withdraw`);

      await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            coins: amount,
            bank: -amount,
          },
        }
      );

      return message.reply(`You withdrew ¥${amount} YunBucks into your wallet`);
    } catch (err) {
      console.log(err);
    }
  },
};