import mongoose, { Schema } from "mongoose";


interface IUsage extends Document {
    voucher: string;
    message?: string;
    redeemedDate: Date;
    completedDate?: Date;
    confirmedDate?: Date;
    status: "pending" | "completed" | "confirmed";
    proofImage?: string;
    voucherRecipient: string;
    voucherCreator: string;
    recipientHasConfirmed: boolean;
    creatorHasConfirmed: boolean;
}

const UsageSchema: Schema<IUsage> = new Schema(
  {
    voucher: { type: String, required: true },
    message: { type: String, required: false, default: null },
    redeemedDate: { type: Date, required: true },
    completedDate: { type: Date, required: false, default: null },
    confirmedDate: { type: Date, required: false, default: null },
    status: { 
        type: String,
        enum: ["pending", "completed", "confirmed"],
        required: true,
        default: "pending"
    },
    proofImage: { type: String, required: false, default: null },
    voucherRecipient: { type: String, required: true },
    voucherCreator: { type: String, required: true },
    recipientHasConfirmed: { type: Boolean, required: false, default: false },
    creatorHasConfirmed: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUsage>("Usage", UsageSchema);
