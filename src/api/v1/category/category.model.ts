import mongoose, { Schema } from "mongoose";

interface IFavoutite {
    by: string;
    date: Date;
}

interface ICategory extends Document {
    name: string;
    createdBy: string;
    favourite: IFavoutite[];
    icon: string;
}

const FavouriteSchema = new Schema<IFavoutite>(
    {
        by: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now }
    },
    { _id: false }
)

const CategorySchema: Schema<ICategory> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        createdBy: { type: String, required: true },
        favourite: { type: [FavouriteSchema] , default: [] },
        icon: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
