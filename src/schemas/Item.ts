import { Schema, model } from "mongoose";
import { IItem } from "../utility/types";

const ItemSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    emoji: { type: String },
    rarity: { type: String },
    description: { type: String },
    attributes: { type: Array<String> },
    price: { type: Number },
    buyable: { type: Boolean },
    consumable: { type: Boolean },
    giftable: { type: Boolean },
});

const ItemModel = model<IItem>("Item", ItemSchema);

export default ItemModel;
