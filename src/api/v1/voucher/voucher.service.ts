import { CreateVoucherDTO, GetVouchersDTO, GetMyVouchersDTO, EditVoucherDTO, RedeemVoucherDTO, UserConfirmationDTO } from "./voucher.schema";
import Voucher from "./voucher.model";
import Usage from "../usage/usage.model";
import { ApiError, ApiSuccess } from "../../../utils/responseHandler";


export class VoucherService {
    static async create(data: CreateVoucherDTO, userId: string) {
        const { title, category, description, count, voucherRecipient } = data;

        await VoucherService.checkIfVoucherExists(title, userId);

        const voucher = new Voucher({ title, category, description, count, voucherCreator: userId, voucherRecipient });
        await voucher.save();

        return ApiSuccess.created(
            'Voucher created successfully',
            { voucher }
        );
    };

    static async getMyAssignedVouchers(data: GetVouchersDTO, userId: string) {
        const { category, sortBy } = data;

        const favourites = await Voucher.find({
            voucherRecipient: userId, category, favourite: { $ne: null }
        }).sort({ createdAt: -1 });

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
        const others = await Voucher.find({
            voucherRecipient: userId, category, favourite: null
        }).sort(sortOption);

        const vouchers = [...favourites, ...others];

        return ApiSuccess.ok(
            '',
            { vouchers }
        );
    }

    static async getMyCreatedVouchers(data: GetMyVouchersDTO, userId: string) {
        const { sortBy } = data;

        const vouchers = await Voucher.find({ voucherCreator: userId });

        const groupedVouchers = vouchers.reduce<Record<string, any[]>>((acc, voucher) => {
            if (!acc[voucher.category]) acc[voucher.category] = [];
            acc[voucher.category].push(voucher);
            return acc;
        }, {});

        function sortVouchers(voucher: any[], sortBy: string) {
            switch (sortBy) {
                case "createdAt":
                    return voucher.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                case "alphabetically":
                default:
                    return voucher.sort((a, b) => a.title.localeCompare(b.title));
            }
        }

        for (const category in groupedVouchers) {
            groupedVouchers[category] = sortVouchers(groupedVouchers[category], sortBy);
        }

        return ApiSuccess.ok(
            '',
            { groupedVouchers }
        );
    }

    static async getMyRedeemedVouchers(userId: string) {
        const voucherUsage = await Usage.find({
            voucherRecipient: userId,
            status: { $ne: "confirmed" }
        }).sort({ createdAt: -1 });

        if (!voucherUsage) {
            return ApiSuccess.ok(
                '',
                {}
            );
        }

        const vouchers = await Promise.all(
            voucherUsage.map(async (usage) => {
                const voucher = await Voucher.findOne({ title: usage.voucher });

                if (!voucher) {
                    return null;
                }

                return {
                    category: voucher.category,
                    title: voucher.title,
                    description: voucher.description,
                    icon: voucher.icon,
                    redeemedDate: usage.redeemedDate,
                    completedDate: usage.completedDate,
                    usageId: usage.id,
                    usageStatus: usage.status
                }
            })
        )

        return ApiSuccess.ok(
            '',
            { vouchers }
        );
    }

    static async getMyRequestedVouchers(userId: string) {
        const voucherUsage = await Usage.find({
            voucherCreator: userId,
            status: { $ne: "confirmed" }
        }).sort({ createdAt: -1 });

        if (!voucherUsage) {
            return ApiSuccess.ok(
                '',
                {}
            );
        }

        const vouchers = await Promise.all(
            voucherUsage.map(async (usage) => {
                const voucher = await Voucher.findOne({ title: usage.voucher });

                if (!voucher) {
                    return null;
                }

                return {
                    category: voucher.category,
                    title: voucher.title,
                    description: voucher.description,
                    icon: voucher.icon,
                    redeemedDate: usage.redeemedDate,
                    completedDate: usage.completedDate,
                    usageId: usage.id,
                    usageStatus: usage.status
                }
            })
        )

        return ApiSuccess.ok(
            '',
            { vouchers }
        );
    };

    static async getVoucherUsageHistory(userId: string) {
        const voucherUsage = await Usage.find({
            status: "confirmed"
        }).sort({ createdAt: -1 });

        if (!voucherUsage) {
            return ApiSuccess.ok(
                '',
                {}
            );
        }

        const vouchers = await Promise.all(
            voucherUsage.map(async (usage) => {
                // TODO: optimize this query so you dont have to fetch on each map item
                const voucher = await Voucher.findOne({ title: usage.voucher });

                if (!voucher) {
                    return null;
                }

                return {
                    category: voucher.category,
                    title: voucher.title,
                    description: voucher.description,
                    icon: voucher.icon,
                    redeemedDate: usage.redeemedDate,
                    completedDate: usage.completedDate,
                    confirmedDate: usage.confirmedDate,
                    usageId: usage.id,
                    usageStatus: usage.status,
                    isRecipient: usage.voucherRecipient === userId ? true : false
                }
            })
        )

        return ApiSuccess.ok(
            '',
            { vouchers }
        );
    }

    static async confirmVoucherCompletedByCreater(data: UserConfirmationDTO, userId: string) {
        const { password, usageId } = data;

        await VoucherService.confirmUsersPassword(userId, password);

        const usage = await Usage.findByIdAndUpdate(
            { _id: usageId },
            {
                $set: {
                    creatorHasConfirmed: true,
                    status: "completed",
                    completedDate: new Date()
                }
            },
            { new: true }
        );

        if (!usage) {
            return ApiError.badRequest('Voucher usage with this usageId does not exists');
        }

        // TODO: send out notification

        return ApiSuccess.ok(
            'Voucher usage successfully confirmed as completed by the creator'
        );
    }

    static async confirmVoucherCompletedByRecipient(data: UserConfirmationDTO, userId: string) {
        const { password, usageId } = data;

        await VoucherService.confirmUsersPassword(userId, password);



        const usage = await Usage.findByIdAndUpdate(
            { _id: usageId, creatorHasConfirmed: true },
            {
                $set: {
                    recipientHasConfirmed: true,
                    status: "confirmed",
                    confirmedDate: new Date()
                }
            },
            { new: true }
        );

        if (!usage) {
            return ApiError.badRequest('Voucher usage with this usageId does not exists');
        }

        // TODO: send out notification

        return ApiSuccess.ok(
            'Voucher usage successfully confirmed as completed by recipient'
        );
    }

    static async editVoucher(data: EditVoucherDTO, userId: string) {
        const { title, description, increment } = data;

        await VoucherService.checkIfVoucherDoesnotExists(title, userId);

        const update: Record<string, any> = {};

        if (description) {
            update.description = description;
        }

        if (increment < 0) {
            return ApiError.badRequest("increment should not be a negative number")
        }

        if (increment !== undefined) {
            update.$inc = { increment };
        }

        const updatedVoucher = await Voucher.findOneAndUpdate(
            { title, voucherCreator: userId },
            update,
            { new: true }
        )

        return ApiSuccess.ok(
            "",
            { updatedVoucher }
        )
    };

    static async redeemVoucher(data: RedeemVoucherDTO, userId: string) {
        const { title, message, voucherCreator, password } = data;

        await VoucherService.confirmUsersPassword(userId, password);

        const voucher = await Voucher.findOne({ title, voucherCreator: userId });

        if (!voucher) {
            return ApiError.badRequest("Voucher with this title and assigned to this userId does not exist");
        };

        if (voucher.count < 1) {
            return ApiError.forbidden("Voucher has not been assigned by owner");
        };

        // TODO: send notification to the creator of the voucher

        voucher.count -= 1
        await voucher.save();

        const usage = new Usage({
            voucher: title,
            message,
            redeemedDate: new Date(),
            status: "pending",
            voucherRecipient: userId,
            voucherCreator
        });
        await usage.save();

        return ApiSuccess.ok("Voucher redeemed successfully", voucher);
    }

    static async checkIfVoucherExists(title: string, voucherCreator: string): Promise<void> {
        const voucher = await Voucher.findOne({ title, voucherCreator });

        if (voucher) {
            throw ApiError.badRequest("Voucher with this title and creator already exists");
        };
    };

    static async checkIfVoucherDoesnotExists(title: string, voucherCreator: string): Promise<void> {
        const voucher = await Voucher.findOne({ title, voucherCreator });

        if (!voucher) {
            throw ApiError.badRequest("Voucher with this title and creator does not exist");
        };
    };

    static async confirmUsersPassword(userId: string, userPassord: string) {
        return true;
    }
};