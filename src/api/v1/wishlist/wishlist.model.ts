import mongoose, { Schema } from "mongoose";


interface IWishlist extends Document {
    title: string;
    description: string;
    icon: string;
    creator: string;
    directedTo: string;
    dateAccepted: Date | null;
}

const WishlistSchema: Schema<IWishlist> = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    creator: { type: String, required: true },
    directedTo: { type: String, required: true },
    dateAccepted: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWishlist>("Wishlist", WishlistSchema);
