module.exports = {
    name: 'balance',
    aliases: ["bal", "bl"],
    description: "check user's balance",
    async execute(client, message, args, Discord, profileData){
        const embed = new Discord.MessageEmbed()
        .setTitle(`**${message.author.username}'s YunBuck Balance**`)
        .setDescription(`**Wallet:** ¥${profileData.coins}\n**Bank:** ¥${profileData.bank}`)
        .setColor('GREEN')

        await message.reply({
            embeds: [embed],
        })
    }
}