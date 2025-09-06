import Voucher from "../voucher/voucher.model";
import Wishlist from "./wishlist.model";
import { ApiError, ApiSuccess } from "../../../utils/responseHandler";
import { AcceptWIshlistVoucherDTO, CreateWishlistVoucherDTO, DeleteWIshlistVoucherDTO, EditWIshlistVoucherDTO } from "./wishlist.schema";


export class WishlistService {
    static async create(data: CreateWishlistVoucherDTO, userId: string) {
        const { title, description, icon, directedTo } = data;

        await WishlistService.checkIfWishlistVoucherExists(title, userId);

        const wishlist = new Wishlist({ title, description, creator: userId, directedTo });
        await wishlist.save();

        return ApiSuccess.created(
            'Wishlist voucher created successfully',
            { wishlist }
        );
    };

    static async delete(data: DeleteWIshlistVoucherDTO, userId: string) {
        const { title } = data;

        const deleteWishlistVoucher = await Wishlist.findOneAndDelete({ title, creator: userId });

        return ApiSuccess.ok(
            '',
            {}
        )
    }

    static async edit(data: EditWIshlistVoucherDTO, userId: string) {
        const { title, description, icon } = data;

        const wishlist = await Wishlist.findOne({ title, userId });

        if (!wishlist) {
            throw ApiError.badRequest("Wishlist voucher with this title and creator does not exist");
        };

        const update: Record<string, any> = {};

        if (description) update.description = description;
        if (icon) update.icon = icon;

        const updatedWishlistVoucher = await Wishlist.findOneAndUpdate(
            { title },
            update,
            { new: true }
        );

        return ApiSuccess.ok(
            '',
            {}
        )
    }

    static async accept(data: AcceptWIshlistVoucherDTO, userId: string) {
        const { title, creator, count } = data;

        const wishlist = await Wishlist.findOne({ title, creator });

        if (!wishlist) {
            throw ApiError.badRequest("Wishlist voucher with this title and creator does not exist");
        };

        const voucher = new Voucher({
            title,
            description: wishlist.description,
            icon: wishlist.icon,
            count,
            voucherCreator: userId,
            voucherRecipient: creator
        });
        await voucher.save();

        wishlist.dateAccepted = new Date();
        await wishlist.save();

        return ApiSuccess.ok(
            '',
            {}
        )
    }

    static async getWishlistVouchers(userId: string) {
        const vouchers = await Wishlist.find({ creator: userId, dateAccepted: null }).sort({ createdAt: -1 });

        return ApiSuccess.ok(
            '',
            { vouchers }
        )
    }

    static async getAcceptedWishlistVouchers(userId: string) {
        const vouchers = await Wishlist.find({ creator: userId, dateAccepted: { $ne: null } }).sort({ createdAt: -1 });

        return ApiSuccess.ok(
            '',
            { vouchers }
        )
    }

    static async checkIfWishlistVoucherExists(title: string, creator: string): Promise<void> {
        const wishlist = await Wishlist.findOne({ title, creator });

        if (wishlist) {
            throw ApiError.badRequest("Wishlist voucher with this title and creator already exists");
        };
    };
};