module.exports = {
    name: "give",
    aliases: [],
    permissions: [],
    description: "give a player some coins",
    async execute(client, message, args, Discord, profileData){
      const profileModel = require("../models/profileSchema");
      if(!args.length) return message.reply("You need to mention someone to give them YunBucks");
      var amount = args[1];
      const target = message.mentions.users.first();
      if(!target) return message.channel.send("Bruh who are you trying to give YunBucks to");
  
      if(args[0] === "all") var amount = profileData.coins;
      if(amount % 1 != 0 || amount <= 0) return message.channel.send("Giving amount must be a whole number silly billy");
  
      try {
        const targetData = await profileModel.findOne({ userID: target.id });
        if (!targetData) return message.reply(`This user has to use a Jonathan Yun command first o.o`);
  
        await profileModel.findOneAndUpdate(
          {
            userID: target.id,
          },
          {
            $inc: {
              coins: amount,
            },
          }
        );
  
        await profileModel.findOneAndUpdate(
          {
            userID: message.author.id,
          },
          {
            $inc: {
              coins: -amount,
            },
          }
        );
  
        return message.reply(`You gave ${target}, ¥${amount} YunBucks!`);
      } catch (err) {
        console.log(err);
      }
    },
  };
  