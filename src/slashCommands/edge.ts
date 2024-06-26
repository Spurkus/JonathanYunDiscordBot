import {
    EmbedBuilder,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessageComponentInteraction,
} from "discord.js";
import { SlashCommand } from "../utility/types";
import {
    getUser,
    createUser,
    removeFromWallet,
    addToWallet,
    addEdgeTotal,
    setEdgeHighest,
    getEdger,
    createEdger,
    removeEffect,
} from "../utility/database";
import { addCommas } from "../utility/functions";
import getEmoji from "../utility/emoji";

const game = (gamble: number, streak: number, disable: boolean, luckActive: boolean) => {
    const message = luckActive ? ":four_leaf_clover: Luck of 8% bonus has been activated\n\n" : "";
    const embed = new EmbedBuilder()
        .setTitle("**Edging Streak Game!!!**")
        .setDescription(
            `${message} Don't edge too hard or you'll bust :face_with_hand_over_mouth:\n**💰 Gamble:** ¥${addCommas(gamble)}\n**🔥 Streak:** ${streak}`
        )
        .setColor("White");

    const edge = new ButtonBuilder()
        .setCustomId("edge")
        .setLabel("Edge")
        .setEmoji("🥴")
        .setDisabled(disable)
        .setStyle(ButtonStyle.Success);

    const cashout = new ButtonBuilder()
        .setCustomId("cashout")
        .setLabel("Cash Out")
        .setEmoji("💸")
        .setDisabled(disable)
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(edge, cashout);

    return { embed, row };
};

const bust = (streak: number, bonus: number): boolean => {
    const probability = Math.random();
    let sum = 0;
    for (let k = 1; k <= streak; k++) {
        sum += (1 / 15) * Math.pow(13 / 20, k - 1);
    }

    return probability * bonus < sum;
};

const winAmount = (gamble: number, streak: number): number => {
    if (streak <= 5) {
        return Math.round(gamble * Math.pow(1.1, streak / 2));
    } else {
        return Math.round(gamble * Math.pow(1.25, streak - 5));
    }
};

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("edge")
        .addStringOption((option) => {
            return option
                .setName("amount")
                .setDescription("The amount of YunBucks you wish to gamble away >:)")
                .setRequired(true);
        })
        .setDescription("lmao gambling addiction moment but edging :3"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const userID = interaction.user.id;
        const emoji = await getEmoji(interaction.client);
        const user = await getUser(userID);
        const edger = await getEdger(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.editReply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already edging smh.\nIt's ok, I will make one for you <3"
            );
        }

        if (!edger) {
            createEdger(userID);
            addToWallet(userID, 1000);
            return interaction.editReply(
                `Ooooooh, I see this is your first time edging!! Here's a ¥1,000 **YunBucks** to get you started ${emoji.jonathan}`
            );
        }

        const amount = interaction.options.getString("amount");

        if (!amount) return interaction.editReply("Bruh, you need amount to edge idiot");

        let gamble: number;
        let streak = 0;

        if (amount.toUpperCase() == "ALL") {
            gamble = user.wallet;
        } else {
            if (!/^\d+$/.test(amount))
                return interaction.editReply(
                    "Gamble amount must be positive numbers (or 'all') you baka >.<"
                );

            gamble = parseInt(amount);

            if (gamble <= 0)
                return interaction.editReply(
                    "Gamble amount must be positive numbers (or 'all') you baka >.<"
                );

            if (gamble > user.wallet)
                return interaction.editReply(
                    "You don't have that amount of **YunBucks** in your wallet to gamble"
                );
        }

        const effectIDs = user.active.map((effect) => effect[0]);
        const luckActive = effectIDs.includes(3); // 3 is Luck effect

        const { embed, row } = game(gamble, streak, false, luckActive);

        const response = await interaction.editReply({
            embeds: [embed],
            components: [row],
        });

        const collectorFilter = (i: MessageComponentInteraction) =>
            i.user.id === interaction.user.id;

        // Listen for interactions on the buttons
        const collector = response.createMessageComponentCollector({
            filter: collectorFilter,
            time: 600000,
        });

        collector.on("collect", async (choice: MessageComponentInteraction) => {
            if (choice.customId == "cashout") {
                const effectIDs = user.active.map((effect) => effect[0]);
                const luckActive = effectIDs.includes(3); // 3 is Luck effect

                const money = winAmount(gamble, streak);
                addToWallet(userID, money - gamble);
                interaction.channel?.send(
                    `Nice! ${interaction.member} edged **${streak}** times, pretty epic! You get an extra ¥${addCommas(money - gamble)} **YunBucks**`
                );
                const { embed, row } = await game(money, streak, true, luckActive);
                await choice.update({
                    embeds: [embed],
                    components: [row],
                });
                collector.stop();
                return;
            }

            const effectIDs = user.active.map((effect) => effect[0]);

            const luckActive = effectIDs.includes(3); // 3 is Luck effect
            const luckBonus = luckActive ? 1.08 : 1;
            if (luckActive) {
                removeEffect(userID, 3, 1);
            }

            if (bust(streak + 1, luckBonus)) {
                addEdgeTotal(userID);
                setEdgeHighest(userID, Math.max(edger.highest, streak));
                removeFromWallet(userID, gamble);
                const cum = new EmbedBuilder().setImage(
                    "https://media1.tenor.com/m/D2ztF2WMSDkAAAAd/cum.gif"
                );
                interaction.channel?.send({
                    content: `Oh no!!! ${interaction.member} edged too hard and busted! You had an edging streak of **${streak}**!`,
                    embeds: [cum],
                });
                const money = winAmount(gamble, streak);
                const { embed, row } = await game(money, streak, true, luckActive);
                await choice.update({
                    embeds: [embed],
                    components: [row],
                });
                collector.stop();
                return;
            } else {
                streak += 1;
                addEdgeTotal(userID);
                setEdgeHighest(userID, Math.max(edger.highest, streak));
                const money = winAmount(gamble, streak);
                const { embed, row } = await game(money, streak, false, luckActive);

                await choice.update({
                    embeds: [embed],
                    components: [row],
                });
            }
        });
    },
    cooldown: 20,
};

export default command;
