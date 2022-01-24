module.exports = {
    name: 'hi',
    description: 'you say hi, he says hi back',
    execute(message, args){
        message.channel.send("Hello, I'm Jonathan Yun");
    }
}