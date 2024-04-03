import { Schema, model } from "mongoose";
import { IItem } from "../utility/types";

const ItemSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String },
    description: { type: String },
    consumable: { type: Boolean },
    giftable: { type: Boolean },
});

const ItemModel = model<IItem>("Item", ItemSchema);

export default ItemModel