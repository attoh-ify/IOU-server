import mongoose, { Schema } from "mongoose";


export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  patnersFavouriteThingAboutYou: string;
  profileImage: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please provide a valid email address",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    patnersFavouriteThingAboutYou: { type: String, required: true, default: "" },
    profileImage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
