module.exports = {
    name: 'balance',
    aliases: ["bal", "bl"],
    description: "check user's balance",
    async execute(client, message, args, Discord, profileData){
        const profileModel = require("../models/profileSchema");
        var name;
        if(!args.length){
            var name = message.author.username;
            var userData = profileData;
        } else if(message.mentions.users.first()){
            const target = message.mentions.users.first();
            const targetData = await profileModel.findOne({ userID: target.id });
            if (!targetData) return message.reply(`This user has to use a Jonathan Yun command first o.o`);
            var name = target.username;
            var userData = targetData
        } else {
            var name = message.author.username;
            var userData = profileData;
        }

        const embed = new Discord.MessageEmbed()
        .setTitle(`**${name}'s YunBuck Balance**`)
        .setDescription(`**Wallet:** ¥${userData.coins}\n**Bank:** ¥${userData.bank}`)
        .setColor('GREEN')

        await message.reply({
            embeds: [embed],
        })
    }
}