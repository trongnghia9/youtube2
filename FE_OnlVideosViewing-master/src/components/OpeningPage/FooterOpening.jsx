import React from "react";
import { LinkedinFilled, FacebookFilled, GithubOutlined } from "@ant-design/icons";

const FooterOpening = () => {
    return (
        <div className="theme-footer border-t">
            <div className="max-w-7xl mx-auto">
                <div className="px-10 py-3 flex justify-between items-center">
                    <div className="footer-left flex flex-col sm:flex-row sm:items-center">
                        <p className="text-sm flex items-center">&copy; 2025 - <span className="mr-2 text-footer ml-1">VietDucTN03</span><span className="hidden sm:block">|</span></p>
                        <p className="sm:mx-2 text-sm flex items-center">Product: <span className="mr-2 text-footer ml-1">MeTube</span><span className="hidden sm:block">|</span></p>
                        <p className="text-sm">Date created: <span className="text-footer">28/01/2025</span></p>
                    </div>
                    <div className="footer-right">
                        <a href="https://www.linkedin.com/in/%C4%91%E1%BB%A9c-tr%C6%B0%C6%A1ng-9b1a94329/" className="icon-footer">
                            <LinkedinFilled className="text-2xl"/>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=100013359581230" className="icon-footer mx-2">
                            <FacebookFilled className="text-2xl"/>
                        </a>
                        <a href="https://github.com/VietDucTN03" className="icon-footer">
                            <GithubOutlined className="text-2xl"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterOpening;