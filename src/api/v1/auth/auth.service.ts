import User from "../user/user.model.js";
import UserService from "../user/user.service.js";
import { LoginUserDTO, RegisterUserDTO } from "./auth.schema.js";
import { ApiSuccess } from "../../../utils/responseHandler.js";
import { generateToken } from "../../../config/token.js";
import { comparePassword, hashPassword } from "../../../utils/validationUtils.js";

export class AuthService {
  static async register(userData: RegisterUserDTO) {
    const { userName, email, password, patnersFavouriteThingAboutYou, profileImage } = userData;

    await UserService.checkIfUserExists(email);

    const hashedPassword = await hashPassword(password);

    const user = new User({
      userName,
      email,
      password: hashedPassword,
      patnersFavouriteThingAboutYou,
      profileImage,
    });

    await user.save();

    return ApiSuccess.created(
      'Registration Successful',
      { user }
    );
  }

  static async login(userData: LoginUserDTO) {
    const { email, password } = userData;
    const user = await UserService.findUserByEmail(email);
    await comparePassword(password, user.password);

    const token = generateToken({ userId: user._id });

    return ApiSuccess.ok("Login Successful", {
      user: { email: user.email, id: user._id },
      token,
    });
  }

  static async getUser(userId: string) {
    const user = await UserService.findUserById(userId);
    return ApiSuccess.ok("User Retrieved Successfully", {
      ...user,
      password: undefined
    });
  }
}

export const authService = new AuthService();
