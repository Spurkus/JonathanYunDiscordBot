import { EmbedBuilder, SlashCommandBuilder, User, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageComponentInteraction, AttachmentBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { getUser, createUser, removeFromWallet, addToWallet } from "../database";

const game = (gamble: number, streak: number) => {
    const embed = new EmbedBuilder()
        .setTitle("Edging Streak Game!!!")
        .setDescription(`Don't edge too hard or you'll bust :face_with_hand_over_mouth:\n**💰 Gamble:** ${gamble}\n**🔥 Streak:** ${streak}`)
        .setColor("White")

    const edge = new ButtonBuilder()
        .setCustomId("edge")
        .setLabel("Edge")
        .setEmoji("🥴")
        .setStyle(ButtonStyle.Success);

    const cashout = new ButtonBuilder()
        .setCustomId("cashout")
        .setLabel("Cash Out")
        .setEmoji("💸")
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(edge, cashout);

    return {embed, row}
}

const bust = (streak: number): boolean => {
    const probability = Math.random();
    let sum = 0;
    for (let k = 1; k <= streak; k++) {
        sum += (1/10) * Math.pow(17/20, k-1);
    }

    return probability < sum;
}

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("edge")
    .addStringOption(option => {
      return option
        .setName("amount")
        .setDescription("The amount of YunBucks you wish to gamble away >:)")
        .setRequired(true);
    })
    .setDescription("lmao gambling addiction moment but edging :3")
    ,
    execute: async interaction => {
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply("You have not made a bank account in 'Yun Banks™' yet, and you're already edging smh.\nIt's ok, I will make one for you <3")
        }

        const amount = interaction.options.getString("amount");

        if (!amount) return interaction.reply("Bruh, you need amount to edge idiot")

        let gamble: number;
        let streak = 0;

        if (amount.toUpperCase() == "ALL") {
            gamble = user.wallet;
        } else {
            if (!/^\d+$/.test(amount)) return interaction.reply("Gamble amount must be positive numbers (or 'all') you baka >.<");
            
            gamble = parseInt(amount);

            if (gamble <= 0) return interaction.reply("Gamble amount must be positive numbers (or 'all') you baka >.<");

            if (gamble > user.wallet) return interaction.reply("You don't have that amount of **YunBucks** in your wallet to gamble");
        }

        const {embed, row} = game(gamble, streak);

        const response = await interaction.reply({ 
            embeds: [embed],
            components: [row],
        });

        const collectorFilter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

        // Listen for interactions on the buttons
        const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 600000 });

        collector.on("collect", async (choice: MessageComponentInteraction) => {
            if (choice.customId == "cashout") {
                const money = Math.round(gamble*(Math.pow(1.08, streak)));
                addToWallet(userID, money - gamble);
                interaction.channel?.send(`Nice! you edged **${streak}** times, pretty epic! You get ¥${money - gamble} extra **YunBucks**`);
                return;
            }

            if (bust(streak + 1)) {
                removeFromWallet(userID, gamble);
                const cum = new AttachmentBuilder("https://tenor.com/view/cum-gif-20534148");
                interaction.channel?.send({
                    content: `Oh no!!! You edged too hard and busted! You had an edging streak of **${streak}**!`,
                    files: [cum]
                });
                return;
            } else {
                streak += 1;
                const money = Math.round(gamble*(Math.pow(1.08, streak)));
                const { embed, row } = await game(money, streak);

                await choice.update({
                    embeds: [embed],
                    components: [row],
                });
            }
        });
    },
    cooldown: 20
}

export default command