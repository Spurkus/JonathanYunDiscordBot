import { Schema, model } from "mongoose";
import { ISex } from "../utility/types";

const defaultDate = new Date();
defaultDate.setHours(0, 0, 0, 0);

const SexSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    date: { type: Date, default: defaultDate },
    total: { type: Number, default: 1 },
    streak: { type: Number, default: 1 },
});

const SexModel = model<ISex>("Sex", SexSchema);

export default SexModel;
