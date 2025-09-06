import { z } from "zod";

export class AuthSchema {
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

    static login = z.object({
        email: z
            .email()
            .min(2, { message: "email is required. It must be at least 2 characters long" }),
        password: z
            .string()
            .min(8, { message: "password is required. It must be at least 8 characters long" }),
    })
}

export type RegisterUserDTO = z.infer<typeof AuthSchema.register>;
export type LoginUserDTO = z.infer<typeof AuthSchema.register>;
