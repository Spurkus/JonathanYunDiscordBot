import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js"
import mongoose from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    modal?: (interaction: ModalSubmitInteraction<CacheType>) => void,
    cooldown?: number // in seconds
}

interface GuildOptions {
    prefix: string,
}

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export interface IUser extends mongoose.Document {
    userId: string;
    bank: number;
    wallet: number;
    inventory: Array<Array<number>>;
}

export interface IEdge extends mongoose.Document {
    userId: string;
    total: number;
    highest: number;
}

export interface ISex extends mongoose.Document {
    userId: string;
    date: Date;
    total: number;
    streak: number;
}

export type rarityType = "Special" | "Mythic" | "Legendary" | "Epic" | "Rare" | "Uncommon" | "Common";

export interface IItem extends mongoose.Document {
    id: number;
    name: string;
    emoji: string;
    rarity: rarityType;
    description: string;
    price: number;
    consumable: boolean;
    giftable: boolean;
}

export interface IJob extends mongoose.Document {
    userId: string;
    date: Date;
    cur: number;
    streak: number;
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            PREFIX: string,
            MONGO_URI: string,
            MONGO_DATABASE_NAME: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}

export type EmojiMap = { [key: string]: GuildEmoji | undefined };