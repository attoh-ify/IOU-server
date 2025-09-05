import mongoose, { Schema } from "mongoose";


interface IVoucher extends Document {
    title: string;
    category: string;
    description: string;
    icon: string;
    count: number;
    voucherCreator: string;
    voucherRecipient: string;
    favourite?: Date;
}

const VoucherSchema: Schema<IVoucher> = new Schema(
  {
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    count: { type: Number, required: true },
    voucherCreator: { type: String, required: true },
    voucherRecipient: { type: String, required: true },
    favourite: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

VoucherSchema.index({ title: 1, voucherCreator: 1 }, { unique: true });
VoucherSchema.index({ voucherRecipient: 1, category: 1 });

export default mongoose.model<IVoucher>("Voucher", VoucherSchema);
