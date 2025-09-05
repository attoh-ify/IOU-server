import { CreateCategoryDTO, GetCategoriesDTO } from "./category.schema";
import Category from "./category.model";
import Voucher from "../voucher/voucher.model";
import { ApiError, ApiSuccess } from "../../../utils/responseHandler";

export class CategoryService {
    static async create(categoryData: CreateCategoryDTO) {
        const { name, createdBy } = categoryData;

        await CategoryService.checkIfCategoryExists(name);

        const category = new Category({ name, createdBy });
        await category.save();

        return ApiSuccess.created(
            'Category created successfully',
            { category }
        );
    };

    static async getCategory(categoryData: GetCategoriesDTO) {
        const { userId, sortBy } = categoryData;
        const favourites = await Category.find({ "favourite.by": userId }).sort({ "favourite.date": 1 });

        let sortOption: Record<string, 1 | -1>;

        switch (sortBy) {
            case "createdAt":
                sortOption = { createdAt: -1 }
                break;
            case "alphabetically":
            default:
                sortOption = { name: 1 }
                break;
        }
        const others = await Category.find({
            favourite: { $not: { $elemMatch: { by: userId } } }
        }).sort(sortOption);

        const categories = [...favourites, ...others];

        const mappedCategories = await Promise.all(
            categories.map(async (cat) => {
                const voucher = await Voucher.find({ voucherRecipient: userId, category: cat.id });
                const voucherCount = voucher.length;
                const voucherUnitCount = voucher.reduce(
                    (sum, doc) => sum + (doc.count || 0),
                    0
                )

                return {
                    name: cat.name,
                    icon: cat.icon,
                    favourite: cat.favourite.some(fav => fav.by === userId),
                    voucherCount,
                    voucherUnitCount
                }
            })
        )

        return ApiSuccess.ok(
            "",
            { ...mappedCategories }
        )
    }

    static async checkIfCategoryExists(name: string): Promise<void> {
        const category = await Category.findOne({ name });

        if (category) {
            throw ApiError.badRequest("Category with this name exists");
        }
    }
}