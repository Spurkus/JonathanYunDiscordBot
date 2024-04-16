import { Schema, model } from "mongoose";
import { IEffect } from "../utility/types";

const EffectSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    emoji: { type: String },
    description: { type: String },
    uses: { type: Number },
});

const EffectModel = model<IEffect>("Effect", EffectSchema);

export default EffectModel;
