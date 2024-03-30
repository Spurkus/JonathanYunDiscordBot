import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    userId: string;
    bank: number;
    wallet: number;
}

const UserSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    bank: { type: Number, default: 500 },
    wallet: { type: Number, default: 0 },
});

const UserModel = mongoose.model<User>("User", UserSchema);

export const getUser = async (userId: string): Promise<User | null> => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOne({ userId }).exec();
}

export const createUser = async (userId: string): Promise<User> => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    const user = new UserModel({ userId });
    return user.save();
}

export const addToBank = async (userId: string, amount: number): Promise<User | null> => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { bank: amount } }, { new: true }).exec();
}

export const removeFromBank = async (userId: string, amount: number): Promise<User | null> => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { bank: -amount } }, { new: true }).exec();
}

export const addToWallet = async (userId: string, amount: number): Promise<User | null> => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { wallet: amount } }, { new: true }).exec();
}

export const removeFromWallet = async (userId: string, amount: number): Promise<User | null> => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    return UserModel.findOneAndUpdate({ userId }, { $inc: { wallet: -amount } }, { new: true }).exec();
}