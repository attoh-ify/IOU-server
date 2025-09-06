import { z } from "zod";

export class VoucherSchema {
    static create = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
        description: z
            .string()
            .min(2, { message: "description is required. It must be at least 2 characters long" }),
        icon: z
            .url()
            .min(2, { message: "icon url is required. It must be at least 2 characters long" }),
        count: z
            .number()
            .int({ message: "count must be an integer" })
            .min(1, { message: "count must be at least 1" }),
        voucherRecipient: z
            .uuid({ message: "voucherRecipient must be a valid UUID" }),
    })

    static getVouchers = z.object({
        sortBy: z
            .enum(["alphabetically", "createdAt"])
            .default("createdAt"),
    })

    static getMyVouchers = z.object({
        sortBy: z
            .enum(["alphabetically", "createdAt"])
            .default("createdAt"),
    })

    static edit = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
        description: z
            .string()
            .min(2, { message: "description is required. It must be at least 2 characters long" })
            .optional(),
        increment: z
            .number()
            .int({ message: "increment must be a positive integer" })
            .min(1, { message: "increment must be at least 1" })
            .optional(),
        isFavourite: z
            .boolean()
            .optional(),
    })

    static redeemVoucher = z.object({
        title: z
            .string()
            .min(2, { message: "title is required. It must be at least 2 characters long" }),
        message: z
            .string()
            .optional(),
        voucherCreator: z
            .uuid({ message: "voucherCreator must be a valid UUID" }),
        password: z
            .string()
            .min(2, { message: "password is required. It must be at least 2 characters long" }),
    })

    static userConfirmation = z.object({
        password: z
            .string()
            .min(2, { message: "password is required. It must be at least 2 characters long" }),
        usageId: z
            .uuid({ message: "usageId must be a valid UUID" }),
        proofImage: z
            .url()
            .optional(),
    })
}

export type CreateVoucherDTO = z.infer<typeof VoucherSchema.create>;
export type GetVouchersDTO = z.infer<typeof VoucherSchema.getVouchers>;
export type GetMyVouchersDTO = z.infer<typeof VoucherSchema.getMyVouchers>;
export type EditVoucherDTO = z.infer<typeof VoucherSchema.edit>;
export type RedeemVoucherDTO = z.infer<typeof VoucherSchema.redeemVoucher>;
export type UserConfirmationDTO = z.infer<typeof VoucherSchema.userConfirmation>;