import { Collection, GuildMember } from "discord.js";
import { connection } from "mongoose";
import { IUser } from "./types";
import UserModel from "./schemas/User";

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