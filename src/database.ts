import { Collection, GuildMember } from "discord.js";
import { connection } from "mongoose";
import { IUser, ISex } from "./types";
import UserModel from "./schemas/User";
import SexModel from "./schemas/Sex";

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
    return SexModel.findOneAndUpdate({ userId }, { $set: { streak: 0 } }, { new: true }).exec();
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
