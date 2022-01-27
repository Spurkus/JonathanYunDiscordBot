module.exports = {
    name: "steal",
    aliases: ["rob"],
    cooldown: 120,
    description: "omg steals from other user omg that's crazy",
    async execute(client, message, args, Discord, profileData){
      const profileModel = require("../models/profileSchema");
      const target = message.mentions.users.first();
      if(!target) return message.channel.send("Who are you stealing from tho >;)");
      try {
        const targetData = await profileModel.findOne({ userID: target.id });
        if(!targetData) return message.reply(`This user has to use a Jonathan Yun command first o.o`);
        if(profileData.coins < 5000) return message.reply("You need at least ¥5000 YunBucks to steal from someone.")
        if(targetData.coins < 500) return message.reply("The person you are trying to steal from BARELY has any YunBucks. Why are you trying to steal from them, just let them be lmao")

        const randomChance = Math.floor(Math.random() * 100);
        if(randomChance >= 40){
          var stolen = true;
          var amount = Math.floor(Math.random() * targetData.coins);
        } else {
          var stolen = false;
          var amount = -5000;
        }
        await profileModel.findOneAndUpdate(
          {
            userID: target.id,
          },
          {
            $inc: {
              coins: -amount,
            },
          }
        );
  
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
        if(stolen === true) return message.reply(`You stole ¥${amount} YunBucks from ${target.username}, you sneaky little baka >.<`)
        return message.reply(`You were caught trying to steal from ¥${target.username}. The police are not daijobu at all an fined you 5000 YunBucks`);
      } catch (err) {
        console.log(err);
      }
    },
  };
  