import mongoose, { Schema } from "mongoose";


interface IUsage extends Document {
    voucher: string;
    redeemedDate: Date;
    completedDate?: Date;
    status: "pending" | "completed";
    proofImage?: string;
}

const UsageSchema: Schema<IUsage> = new Schema(
  {
    voucher: { type: String, required: true },
    redeemedDate: { type: Date, required: true },
    completedDate: { type: Date, required: false, default: null },
    status: { 
        type: String,
        enum: ["pending", "completed"],
        required: true,
        default: "pending"
    },
    proofImage: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUsage>("Usage", UsageSchema);
