import { z } from "zod";

export class VoucherSchema {
    static create = z.object({
        title: z
            .string()
            .min(2, { message: "Title is required. It must be at least 2 characters long" }),
        category: z
            .string()
            .min(2, { message: "Category is required. It must be at least 2 characters long" }),
        description: z
            .string()
            .min(2, { message: "Description is required. It must be at least 2 characters long" }),
        icon: z
            .url()
            .min(2, { message: "Icon url is required. It must be at least 2 characters long" }),
        count: z
            .number()
            .int({ message: "Count must be an integer" })
            .min(1, { message: "Count must be at least 1" }),
        createdBy: z
            .uuid({ message: "CreatedBy must be a valid UUID" }),
        assignedTo: z
            .uuid({ message: "AssignedTo must be a valid UUID" }),
    })

    static getVouchers = z.object({
        userId: z
            .uuid({ message: "UserId must be a valid UUID" }),
        category: z
            .uuid({ message: "Category must be a valid UUID" }),
        sortBy: z
            .enum(["alphabetically", "createdAt"])
            .default("createdAt"),
    })

    static getMyVouchers = z.object({
        userId: z
            .uuid({ message: "UserId must be a valid UUID" }),
    })

    static edit = z.object({
        title: z
            .string()
            .min(2, { message: "Title is required. It must be at least 2 characters long" }),
        createdBy: z
            .uuid({ message: "CreatedBy must be a valid UUID" }),
        description: z
            .string()
            .min(2, { message: "Description is required. It must be at least 2 characters long" }),
        count: z
            .number()
            .int({ message: "Count must be an integer" })
            .min(1, { message: "Count must be at least 1" }),
    })
}

export type CreateVoucherDTO = z.infer<typeof VoucherSchema.create>;
export type GetVouchersDTO = z.infer<typeof VoucherSchema.getVouchers>;
export type GetMyVouchersDTO = z.infer<typeof VoucherSchema.getMyVouchers>;
export type EditVoucherDTO = z.infer<typeof VoucherSchema.edit>;
