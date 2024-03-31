import { Schema, model } from "mongoose";
import { ISex } from "../types";
import { getDateString } from "../functions";

const defaultDate = new Date();

const SexSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    date: { type: Date, default: defaultDate},
    total: { type: Number, default: 1 },
    streak: { type: Number, default: 1 },
});

const SexModel = model<ISex>("Sex", SexSchema);

export default SexModel