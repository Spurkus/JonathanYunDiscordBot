import { Schema, model } from "mongoose";
import { IEdge } from "../utility/types";

const EdgeSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    total: { type: Number, default: 0 },
    highest: { type: Number, default: 0 },
});

const EdgeModel = model<IEdge>("Edgers", EdgeSchema);

export default EdgeModel;
