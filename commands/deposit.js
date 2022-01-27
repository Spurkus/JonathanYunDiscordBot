module.exports = {
  name: "deposit",
  aliases: ["dep"],
  permissions: [],
  description: "Deposit coins into your bank!",
  async execute(client, message, args, Discord, profileData){
    const profileModel = require("../models/profileSchema");
    var amount = args[0];
    if(args[0] === "all") var amount = profileData.coins;

    if (amount % 1 != 0 || amount <= 0) return message.channel.send("Deposit amount must be a whole number");
    try {
      if (amount > profileData.coins) return message.channel.send(`You don't have that amount YunBucks to deposit`);
      await profileModel.findOneAndUpdate(
        {
          userID: message.author.id,
        },
        {
          $inc: {
            coins: -amount,
            bank: amount,
          },
        }
      );

      return message.channel.send(`You deposited ¥${amount} YunBucks into your bank`);
    } catch (err) {
      console.log(err);
    }
  },
};


