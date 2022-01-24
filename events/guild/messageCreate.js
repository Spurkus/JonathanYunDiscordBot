module.exports = async (client, Discord, message) => {
    const prefix = '!J ';
    const profileModel = require("../../models/profileSchema");
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                coins: 1000,
                bank: 0,
            });
            profile.save();
        }
    } catch (err) {
        console.log(err);
    }
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

    if(command){
        command.execute(client, message, args, Discord, profileData);
    } else {
        message.channel.send("this isn't a command lol");
    } 
}