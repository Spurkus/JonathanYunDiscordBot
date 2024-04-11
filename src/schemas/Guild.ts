import { Schema, model } from "mongoose";
import { IGuild } from "../utility/types";

const GuildSchema = new Schema<IGuild>({
    guildID: { required: true, type: String },
    options: {
        prefix: { type: String, default: process.env.PREFIX },
    },
});

const GuildModel = model("guild", GuildSchema);

export default GuildModel;
