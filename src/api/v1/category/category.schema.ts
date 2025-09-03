import { z } from "zod";

export class CategorySchema {
    static create = z.object({
        name: z
            .string()
            .min(2, { message: "Category name is required. It must be at least 2 characters long" }),
        createdBy: z
            .uuid({ message: "CreatedBy must be a valid UUID" }),
        icon: z
            .url()
            .min(2, { message: "Icon url is required. It must be at least 2 characters long" })
    });

    static getCategories = z.object({
        userId: z
            .uuid({ message: "UserId must be a valid UUID" }),
        sortBy: z
            .enum(["alphabetically", "createdAt"])
            .default("createdAt"),
    })
}

export type CreateCategoryDTO = z.infer<typeof CategorySchema.create>;
export type GetCategoriesDTO = z.infer<typeof CategorySchema.getCategories>;