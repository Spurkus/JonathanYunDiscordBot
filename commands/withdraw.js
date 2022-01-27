const profileModel = require("../models/profileSchema");
module.exports = {
  name: "withdraw",
  aliases: ["wd"],
  permissions: [],
  description: "withdraw coins from your bank",
  async execute(client, message, args, Discord, profileData){
    const amount = args[0];
    if (amount % 1 != 0 || amount <= 0) return message.reply("Withdrawn amount must be a whole number");

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

      return message.reply(`You withdrew ¥${amount} of YunBucks into your wallet`);
    } catch (err) {
      console.log(err);
    }
  },
};