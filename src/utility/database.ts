import { Collection, GuildMember } from "discord.js";
import { connection } from "mongoose";
import { IUser, ISex, IEdge, IItem, IJob, rarityType } from "./types";
import UserModel from "../schemas/User";
import SexModel from "../schemas/Sex";
import EdgeModel from "../schemas/Edge";
import ItemModel from "../schemas/Item";
import JobModel from "../schemas/Job";

export const getUser = async (userId: string): Promise<IUser | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOne({ userId }).exec();
}

export const createUser = async (userId: string): Promise<IUser> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    const user = new UserModel({ userId });
    return user.save();
}

export const addToBank = async (userId: string, amount: number): Promise<IUser | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { bank: amount } }, { new: true }).exec();
}

export const removeFromBank = async (userId: string, amount: number): Promise<IUser | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { bank: -amount } }, { new: true }).exec();
}

export const addToWallet = async (userId: string, amount: number): Promise<IUser | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { wallet: amount } }, { new: true }).exec();
}

export const removeFromWallet = async (userId: string, amount: number): Promise<IUser | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { wallet: -amount } }, { new: true }).exec();
}

export const getTopUsers = async (membersPromise: Promise<Collection<string, GuildMember>>, limit: number): Promise<IUser[]> => {
    const members = await membersPromise;
    const allUsers = await getAllUsers();
    const serverUserIds: Set<string> = new Set(members.map(member => member.id));
    const serverUsers = allUsers.filter(user => serverUserIds.has(user.userId));
    const sortedUsers = serverUsers.sort((a, b) => calculateNetWorth(b) - calculateNetWorth(a));
    return sortedUsers.slice(0, limit);
}

export const getAllUsers = async (): Promise<IUser[]> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.find().exec()
}

export const calculateNetWorth = (user: IUser): number => {
    return user.wallet + user.bank;
}

export const getSex = async (userId: string): Promise<ISex | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return SexModel.findOne({ userId }).exec();
}

export const createSex = async (userId: string): Promise<ISex> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    const sex = new SexModel({ userId });
    return sex.save();
}

export const addTotal = async (userId: string): Promise<ISex | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return SexModel.findOneAndUpdate({ userId }, { $inc: { total: 1 } }, { new: true }).exec();
}

export const addStreak = async (userId: string): Promise<ISex | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return SexModel.findOneAndUpdate({ userId }, { $inc: { streak: 1 } }, { new: true }).exec();
}

export const resetStreak = async (userId: string): Promise<ISex | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return SexModel.findOneAndUpdate({ userId }, { $set: { streak: 1 } }, { new: true }).exec();
}

export const setDate = async (userId: string): Promise<ISex | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    const date = new Date()
    return SexModel.findOneAndUpdate({ userId }, { $set: { date: date } }, { new: true }).exec();
}

export const getAllSex = async (): Promise<ISex[]> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return SexModel.find().exec()
}

export const getTopSex = async (membersPromise: Promise<Collection<string, GuildMember>>, limit: number): Promise<ISex[]> => {
    const members = await membersPromise;
    const allSexUsers = await getAllSex(); // Function to get all sex users from your database
    const serverUserIds: Set<string> = new Set(members.map(member => member.id));
    const serverSexUsers = allSexUsers.filter(user => serverUserIds.has(user.userId));
    const sortedUsers = serverSexUsers.sort((a, b) => b.total - a.total); // Sorting based on sex
    return sortedUsers.slice(0, limit);
}

export const getTopSexStreak = async (membersPromise: Promise<Collection<string, GuildMember>>, limit: number): Promise<ISex[]> => {
    const members = await membersPromise;
    const allSexUsers = await getAllSex(); // Function to get all sex users from your database
    const serverUserIds: Set<string> = new Set(members.map(member => member.id));
    const serverSexUsers = allSexUsers.filter(user => serverUserIds.has(user.userId));
    const sortedUsers = serverSexUsers.sort((a, b) => b.streak - a.streak); // Sorting based on sex streak
    return sortedUsers.slice(0, limit);
}

export const getEdger = async (userId: string): Promise<IEdge | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return EdgeModel.findOne({ userId }).exec();
}

export const createEdger = async (userId: string): Promise<IEdge> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    const edge = new EdgeModel({ userId });
    return edge.save();
}

export const addEdgeTotal = async (userId: string): Promise<IEdge | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return EdgeModel.findOneAndUpdate({ userId }, { $inc: { total: 1 } }, { new: true }).exec();
}

export const setEdgeHighest = async (userId: string, edge: number): Promise<IEdge | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return EdgeModel.findOneAndUpdate({ userId }, { $set: { highest: edge } }, { new: true }).exec();
}

export const getAllEdgers = async (): Promise<IEdge[]> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return EdgeModel.find().exec()
}

export const getTopEdge = async (membersPromise: Promise<Collection<string, GuildMember>>, limit: number): Promise<IEdge[]> => {
    const members = await membersPromise;
    const allEdgers = await getAllEdgers(); // Function to get all edge users from your database
    const serverUserIds: Set<string> = new Set(members.map(member => member.id));
    const serverEdgers = allEdgers.filter(user => serverUserIds.has(user.userId));
    const sortedUsers = serverEdgers.sort((a, b) => b.total - a.total); // Sorting based on total
    return sortedUsers.slice(0, limit);
}

export const getTopEdgeHighest = async (membersPromise: Promise<Collection<string, GuildMember>>, limit: number): Promise<IEdge[]> => {
    const members = await membersPromise;
    const allEdgers = await getAllEdgers(); // Function to get all edge users from your database
    const serverUserIds: Set<string> = new Set(members.map(member => member.id));
    const serverEdgers = allEdgers.filter(user => serverUserIds.has(user.userId));
    const sortedUsers = serverEdgers.sort((a, b) => b.highest - a.highest); // Sorting based on highest edge streak
    return sortedUsers.slice(0, limit);
}

export const getItem = async (id: string): Promise<IItem | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return ItemModel.findOne({ id }).exec();
}

export const getItemName = async (name: string): Promise<IItem | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return ItemModel.findOne({ name }).exec();
}

export const getAllItems = async (): Promise<IItem[]> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return ItemModel.find().exec()
}

export const createItem = async (id: number, name: string, emoji: string, rarity: rarityType, description: string, price: number, consumable: boolean, giftable: boolean): Promise<IItem> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    const item = new ItemModel({ id, name, emoji, rarity, description, price, consumable, giftable });
    return item.save();
}

export const getWorker = async (userId: string): Promise<IJob | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    return JobModel.findOne({ userId }).exec();
}

export const addJob = async (userId: string, job: number): Promise<IJob | null> => {
    if (connection.readyState === 0) throw new Error("Database not connected.");
    const updatedJob = await JobModel.findOneAndUpdate({ userId }, { $set: { cur: job } }, { new: true }).exec();
    return updatedJob;
};

export const createWorker = async (userId: string): Promise<IJob> => {
    if (connection.readyState === 0) throw new Error("Database not connected.")
    const work = new JobModel({ userId });
    return work.save();
}