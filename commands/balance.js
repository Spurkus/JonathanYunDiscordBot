module.exports = {
    name: 'balance',
    aliases: ["bal", "bl"],
    description: "check user's balance",
    async execute(client, message, args, Discord, profileData){
        const embed = new Discord.MessageEmbed()
        .setTitle('Balance')
        .setDescription(`Wallet: ${profileData.coins}\nBank: ${profileData.bank}`)
        .setColor('GREEN')

        await message.reply({
            embeds: [embed],
        })
    }
}