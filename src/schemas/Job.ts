import { Schema, model } from "mongoose";
import { IJob } from "../utility/types";

const defaultDate = new Date();
defaultDate.setHours(0, 0, 0, 0);

const JobSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    date: { type: Date, default: defaultDate},
    cur: {type: Number, default: 0},
    streak: { type: Number, default: 1 },
});

const JobModel = model<IJob>("Workers", JobSchema);

export default JobModel