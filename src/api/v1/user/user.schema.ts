import { optional, z } from "zod";


export class UserSchema {
    static register = z.object({
        userName: z
            .string()
            .min(2, { message: "userName is required. It must be at least 2 characters long" }),
        email: z
            .email()
            .min(2, { message: "email is required." }),
        password: z
            .string()
            .min(8, { message: "password is required. It must be at least 8 characters long" }),
        patnersFavouriteThingAboutYou: z
            .string()
            .min(20, { message: "patnersFavouriteThingAboutYou is required. It must be at least 20 characters long" })
            .optional(),
        profileImage: z
            .string()
            .min(2, { message: "profileImage url is required. It must be at least 2 characters long" }),
    })

    static editMyProfile = z.object({
        email: z
            .email()
            .min(2, { message: "email is required." })
            .optional(),
        password: z
            .string()
            .min(8, { message: "password is required. It must be at least 8 characters long" })
            .optional(),
    })

    static editMyPartnersProfile = z.object({
        patnersUserId: z
            .email()
            .min(20, { message: "patnersFavouriteThingAboutYou is required. It must be at least 20 characters long" }),
        userName: z
            .string()
            .min(2, { message: "userName is required. It must be at least 2 characters long" })
            .optional(),
        patnersFavouriteThingAboutYou: z
            .string()
            .min(20, { message: "patnersFavouriteThingAboutYou is required. It must be at least 20 characters long" })
            .optional(),
        profileImage: z
            .string()
            .min(2, { message: "profileImage url is required. It must be at least 2 characters long" })
            .optional(),
        
    })
}

export type RegisterUserDTO = z.infer<typeof UserSchema.register>;
export type EditMyProfileDTO = z.infer<typeof UserSchema.editMyProfile>;
export type EditMyPartnersProfileDTO = z.infer<typeof UserSchema.editMyPartnersProfile>;
