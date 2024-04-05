import { Schema, model } from "mongoose";
import { IUser } from "../utility/types";

const UserSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    bank: { type: Number, default: 500 },
    wallet: { type: Number, default: 0 },
    inventory: { type: Array<Array<Number>> }
});

const UserModel = model<IUser>("User", UserSchema);

export default UserModel