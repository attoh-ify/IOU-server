import { z } from "zod";

export class WishlistSchema {
    static create = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
        description: z
            .string()
            .min(2, { message: "description is required. It must be at least 2 characters long" }),
        icon: z
            .url(),
        directedTo: z
            .uuid({ message: "directedTo must be a valid UUID" }),
    })

    static delete = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
    })

    static edit = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
        description: z
            .string()
            .min(2, { message: "description is required. It must be at least 2 characters long" })
            .optional(),
        icon: z
            .url()
            .optional(),
    })

    static accept = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
        creator: z
            .uuid({ message: "creator must be a valid UUID" }),
        count: z
            .number()
            .int({ message: "count must be an integer" })
            .min(1, { message: "count must be at least 1" }),
    })
}

export type CreateWishlistVoucherDTO = z.infer<typeof WishlistSchema.create>;
export type DeleteWIshlistVoucherDTO = z.infer<typeof WishlistSchema.delete>;
export type EditWIshlistVoucherDTO = z.infer<typeof WishlistSchema.edit>;
export type AcceptWIshlistVoucherDTO = z.infer<typeof WishlistSchema.accept>;