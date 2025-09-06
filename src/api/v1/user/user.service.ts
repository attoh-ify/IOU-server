import User, { IUser } from "./user.model";
import { ApiError, ApiSuccess } from "../../../utils/responseHandler";
import { EditMyPartnersProfileDTO, EditMyProfileDTO, RegisterUserDTO } from "./user.schema";
import { hashPassword } from "../../../utils/validationUtils";

class UserService {
  static async createUser(userData: RegisterUserDTO): Promise<IUser> {
    const { userName, email, password, patnersFavouriteThingAboutYou, profileImage } = userData;

    const hashedPassword = await hashPassword(password);

    const user = new User({
      userName,
      email,
      password: hashedPassword,
      patnersFavouriteThingAboutYou,
      profileImage,
    });

    await user.save();

    return user;
  }

  static async editMyProfile(userData: EditMyProfileDTO, userId: string) {
    const { email, password } = userData;

    const update: Record<string, any> = {};

    if (email) update.email = email;

    if (password) {
      const hashedPassword = await hashPassword(password);
      update.password = hashPassword;
    };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        update
      },
      { new: true }
    )

    return ApiSuccess.ok(
      '',
      { updateUser }
    )
  }

  static async editMyPatnersProfile(userData: EditMyPartnersProfileDTO) {
    const { patnersUserId, userName, patnersFavouriteThingAboutYou, profileImage } = userData;

    const update: Record<string, any> = {};

    if (userName) update.userName = userName;
    if (patnersFavouriteThingAboutYou) update.patnersFavouriteThingAboutYou = patnersFavouriteThingAboutYou;
    if (profileImage) update.profileImage = profileImage;

    const updateUser = await User.findByIdAndUpdate(
      patnersUserId,
      {
        update
      },
      { new: true }
    )

    return ApiSuccess.ok(
      '',
      { updateUser }
    )
  }

  static async findUserByEmail(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound("No user with this email");
    }
    return user;
  }

  static async findUserById(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User Not Found");
    }

    return user;
  }

  static async checkIfUserExists(email: string): Promise<void> {
    const user = await User.findOne({ email });

    if (user) {
      throw ApiError.badRequest("User with this email exists");
    }
  }
}

export default UserService;
