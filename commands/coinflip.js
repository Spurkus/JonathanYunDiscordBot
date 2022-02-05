module.exports = {
    name: "coinflip",
    aliases: [],
    cooldown: 10,
    description: "lmao gambling addiction moment",
    async execute(client, message, args, Discord, profileData){
      const profileModel = require("../models/profileSchema");
      var amount = args[0];
      if(args[0] === "all") var amount = profileData.coins;
      if (amount % 1 != 0 || amount <= 0) return message.reply("Gambling amount must be a whole number you baka >.<");
      try {
        if (amount > profileData.coins) return message.reply(`You don't have that amount of YunBucks to gamble`);

        if(message.author.name === "Ellaful"){
          var gambleChance = 0.2;
        } else {
          var gambleChance = 0.5;
        }
        const randomChance = Math.random();
        if(randomChance < gambleChance){
            var gamble = true;
        } else {
            var gamble = false;
            amount = -amount;
            var pos = amount * -1;
        }
        await profileModel.findOneAndUpdate(
          {
            userID: message.author.id,
          },
          {
            $inc: {
              coins: amount,
            },
          }
        );
        if(gamble == true) return message.reply(`AYYY YOU WON!!! ¥${amount} YunBucks was added into your wallet`);
          return message.reply(`LMAOOO IMAGINE LOSING THAT MUCH MONEY LLLL. ¥${pos} YunBucks was taken from your wallet`);
      } catch (err) {
        console.log(err);
      } 
    }
  };
  