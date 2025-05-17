import React from "react";
import { FaUserCheck } from "react-icons/fa";

const PremiumPurchasePage = () => {
    return (
        <>
            <div className="pt-10 pb-16 flex flex-col items-center theme-second theme-text-first">
                <div className="flex items-center justify-center">
                    <div className="w-28 h-28">
                        <img src="https://res.cloudinary.com/digngxuqg/image/upload/v1747337486/Logo-removebg_oyenuh.png" alt="banner_premium" />
                    </div>
                    <p className="text-3xl font-bold">Metube Premium</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-6">
                    <div className="w-2/3">
                        <p className="text-6xl font-bold text-center leading-[1.15]">Nâng cao trải nghiệm Metube mà không bị gián đoạn.</p>
                    </div>
                    <div className="">
                        <p className="text-lg font-medium">Dùng thử 1 tháng với giá 0 ₫ • Sau đó là 79.000₫ ⁠/ ⁠tháng • Không bao gồm thuế GTGT • Hủy bất cứ lúc nào</p>
                    </div>
                    <div className="">
                        <p className="text-4xl font-bold">Chọn gói thành viên phù hợp với bạn</p>
                    </div>
                    <div className="mt-2">
                        <div className="card theme-card-second px-5 pt-5 pb-4 rounded-2xl shadow-sm">
                            <div className="card-header flex items-center gap-2 border-b-1.5 pb-1.5">
                                <FaUserCheck className="text-xl"/>
                                <p className="text-lg">Cá nhân</p>
                            </div>
                            <div className="card-body py-3 flex flex-col gap-1 border-b-1.5">
                                <p className="text-sm font-medium">Gói theo tháng</p>
                                <p className="text-2xl font-semibold">79.000₫ ⁠/ ⁠tháng</p>
                                <p className="text-sm">Không bao gồm thuế GTGT</p>
                            </div>
                            <div className="card-footer pt-2.5">
                                <button className="btn-1 w-full rounded-full py-1.25">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PremiumPurchasePage;