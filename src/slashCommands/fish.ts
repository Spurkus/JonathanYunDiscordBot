import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    CacheType,
} from "discord.js";
import { rarityType, IItem, IUser, SlashCommand, EmojiMap } from "../utility/types";
import {
    getUser,
    createUser,
    removeEffect,
    addToInventory,
    getItem,
    rarityOrder,
    removeFromInventory,
    getAllItemAttribute,
} from "../utility/database";
import getEmoji from "../utility/emoji";

const getHighestRarityFishingRod = async (
    inventory: [number, number][]
): Promise<IItem | undefined> => {
    // Filter out fishing rods from the inventory
    const items = await Promise.all(
        inventory.map(async ([itemId, _]) => {
            const item = await getItem(itemId);
            return item;
        })
    );

    const fishingRods = items.filter((item) => item?.attributes.includes("Fishing Rod"));

    // Find the fishing rod with the highest rarity
    let highestRarityRod: IItem | undefined;
    let highestRarity: rarityType = "Common"; // Lowest rarity by default

    fishingRods.forEach(async (rodItem) => {
        if (rodItem && rarityOrder[rodItem.rarity] >= rarityOrder[highestRarity]) {
            highestRarity = rodItem.rarity;
            highestRarityRod = rodItem;
        }
    });

    return highestRarityRod;
};

const fishing = async (
    interaction: ChatInputCommandInteraction<CacheType>,
    userID: string,
    user: IUser,
    emoji: EmojiMap
): Promise<string> => {
    // User does not have fishing rod in inventory
    const fishingRod = await getHighestRarityFishingRod(user.inventory);
    if (!fishingRod) return `You don't even have a 🎣 **Fishing Rod** in your inventory XD`;
    const rodRarity = rarityOrder[fishingRod.rarity];

    const effectIDs = user.active.map((effect) => effect[0]);
    let messageActive: String = `Using ${emoji[fishingRod.emoji]} **${fishingRod.name}**,\n`;
    const luckActive = effectIDs.includes(3); // 3 is Luck effect
    const luckBonus = luckActive ? 1.08 : 1;
    if (luckActive) {
        removeEffect(userID, 3, 1);
        messageActive += ":four_leaf_clover: Luck of 8% bonus has been activated\n";
    }

    const randomChance = Math.random() * 100 * luckBonus * Math.pow(1.1, rodRarity);

    // Fishing Rod destroyed
    if (randomChance <= 0.5) {
        removeFromInventory(userID, fishingRod.id, 1);
        return `${messageActive}\n${interaction.member} fished too hard and ${emoji[fishingRod.emoji]} **${fishingRod.name}** broke :rofl:`;
    }

    // Fishes nothing
    if (randomChance <= 4) {
        return `${messageActive}\n${interaction.member} fished and the fishes hate you so nothing came up.`;
    }

    // Gets old boot
    if (randomChance <= 8) {
        addToInventory(userID, 6, 1);
        return `${messageActive}\n${interaction.member} fished and hooked onto something!!! Unfortunately it was an old boot XD.\nYou received 1 🥾 **Old Boot**.`;
    }

    // Fishing Success!!
    let messageFish = "";
    const fishes = await getAllItemAttribute("Fish");
    const amountArray: Array<number> = [];
    const fishIdArray: Array<number> = [];

    fishes.forEach((fish) => {
        const rarityMultiplier = 1 + Math.pow(2, rodRarity); // Increase fish amount based on rod rarity
        let fishAmount = 0;

        if (fish.rarity === "Common") {
            fishAmount = Math.round((Math.random() * rarityMultiplier + 1) * luckBonus);
        } else if (fish.rarity === "Uncommon") {
            fishAmount = Math.round(Math.random() * 0.5 * rarityMultiplier * luckBonus);
        } else if (fish.rarity === "Rare") {
            fishAmount = Math.round(Math.random() * 0.125 * rarityMultiplier * luckBonus);
        } else if (fish.rarity === "Epic") {
            fishAmount = Math.round(Math.random() * 0.055 * rarityMultiplier * luckBonus);
        } else if (fish.rarity === "Legendary") {
            fishAmount = Math.round(Math.random() * 0.0225 * rarityMultiplier * luckBonus);
        } else if (fish.rarity === "Mythic") {
            fishAmount = Math.round(Math.random() * 0.015 * rarityMultiplier * luckBonus);
        }

        if (fishAmount != 0) {
            fishIdArray.push(fish.id);
            amountArray.push(fishAmount);
            messageFish += `${fishAmount} ${emoji[fish.emoji]} **${fish.name} [${fish.rarity}]** was caught\n`;
        }
    });

    addToInventory(userID, fishIdArray, amountArray);
    return `${messageActive}\n${messageFish}`;
};

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("fish")
        .setDescription("Fish with a fishing rod for a few YunBucks"),
    execute: async (interaction) => {
        await interaction.deferReply();

        const emoji = await getEmoji(interaction.client);
        const userID = interaction.user.id;
        const user = await getUser(userID);

        // User has not tried any economy things yet :3
        if (!user) {
            createUser(userID);
            return interaction.reply(
                "You have not made a bank account in 'Yun Banks™' yet, and you're already trying to fish smh.\nIt's ok, I will make one for you <3"
            );
        }

        const message = await fishing(interaction, userID, user, emoji);
        const embed = new EmbedBuilder()
            .setTitle("💦 **Fishing Time!!!** 💦")
            .setDescription(message)
            .setColor("Blue");

        return await interaction.editReply({ embeds: [embed] });
    },
    cooldown: 10,
};

export default command;
