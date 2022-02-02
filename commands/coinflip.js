module.exports = {
    name: "coinflip",
    aliases: [],
    cooldown: 10,
    description: "lmao gambling addiction moment",
    async execute(client, message, args, Discord, profileData){
      const profileModel = require("../models/profileSchema");
      var amount = args[0];
      if(args[0] === "all") var amount = profileData.bank;
      if (amount % 1 != 0 || amount <= 0) return message.reply("Withdrawn amount must be a whole number you baka >.<");
      try {
        if (amount > profileData.bank) return message.reply(`You don't have that amount of YunBucks to gamble`);

        const randomChance = Math.random();
        if(randomChance < 0.5){
            var gamble = true;
            amount *= 2;
        } else {
            var gamble = false;
            amount = -amount;
        }
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
      } catch (err) {
        console.log(err);

        if(gamble == true){
            return message.reply(`AYYY YOU WON!!! ¥${amount} YunBucks was added into your wallet`);
        } else {
            return message.reply(`LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${amount} YunBucks was taken from your wallet`);
        }
      } 
    }
  };
  