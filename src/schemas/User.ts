import { Schema, model } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    bank: { type: Number, default: 500 },
    wallet: { type: Number, default: 0 },
    sex: { type: Boolean, default: false },
    lastSex: { type: Date}
});

const UserModel = model<IUser>("User", UserSchema);

export default UserModel