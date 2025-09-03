import { CreateVoucherDTO, GetVouchersDTO, GetMyVouchersDTO, EditVoucherDTO } from "./voucher.schema";
import Voucher from "./voucher.model";
import { ApiError, ApiSuccess } from "../../../utils/responseHandler";

export class VoucherService {
    static async create(voucherData: CreateVoucherDTO) {
        const { title, category, description, count, createdBy, assignedTo } = voucherData;

        await VoucherService.checkIfVoucherExists(title, createdBy);

        const voucher = new Voucher({ title, category, description, count, createdBy, assignedTo });
        await voucher.save();

        return ApiSuccess.created(
            'Voucher created successfully',
            { voucher }
        );
    };

    static async getVouchers(voucherData: GetVouchersDTO) {
        const { userId, category, sortBy } = voucherData;

        const favourites = await Voucher.find({
            assignedTo: userId, category, favourite: { $ne: null }
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
            assignedTo: userId, category, favourite: null
        }).sort(sortOption);

        const vouchers = [...favourites, ...others];

        return ApiSuccess.ok(
            '',
            { vouchers }
        );
    }

    static async getMyVouchers(voucherData: GetMyVouchersDTO) {
        const { userId } = voucherData;

        const vouchers = await Voucher.find({ createdBy: userId }).sort({ createdAt: -1 });

        return ApiSuccess.ok(
            '',
            { vouchers }
        );
    }

    static async editVoucher(voucherData: EditVoucherDTO) {
        const { title, createdBy, description, count } = voucherData;

        await VoucherService.checkIfVoucherDoesnotExists(title, createdBy);

        const update: Record<string, any> = {};

        if (description) {
            update.description = description;
        }

        if (count !== undefined) {
            update.$inc = { count };
        }

        const updatedVoucher = await Voucher.findOneAndUpdate(
            { title, createdBy },
            update,
            { new: true }
        )

        return ApiSuccess.ok(
            "",
            { updatedVoucher }
        )
    }

    static async checkIfVoucherExists(title: string, createdBy: string): Promise<void> {
        const voucher = await Voucher.findOne({ title, createdBy });

        if (voucher) {
            throw ApiError.badRequest("Voucher with this title and creator already exists");
        };
    };

    static async checkIfVoucherDoesnotExists(title: string, createdBy: string): Promise<void> {
        const voucher = await Voucher.findOne({ title, createdBy });

        if (!voucher) {
            throw ApiError.badRequest("Voucher with this title and creator does not exist");
        };
    };
};