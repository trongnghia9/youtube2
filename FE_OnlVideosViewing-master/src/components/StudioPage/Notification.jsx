import React, { useEffect, useState } from "react";
import { FaCircleInfo, FaRegCircleCheck, FaRegCircleXmark, FaTriangleExclamation } from "react-icons/fa6";
import { TbEyeClosed } from "react-icons/tb";
import classNames from "classnames";

const icons = {
    success: <FaRegCircleCheck className="text-green-500 size-5" />,
    error: <FaRegCircleXmark className="text-red-500 size-5" />,
    warning: <FaTriangleExclamation className="text-yellow-500 size-5" />,
    info: <FaCircleInfo className="text-blue-500 size-5" />,
};

const Notification = ({ type = "info", message, description, duration = 3000, onClose }) => {
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const start = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const percentage = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(percentage);
        }, 50);

        const timer = setTimeout(() => handleClose(), duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [duration]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300); // Chờ animation kết thúc
    };

    return (
        <div className={classNames("relative w-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4 mb-2 transition-all duration-300 transform", { "opacity-0 translate-x-full": !visible, "opacity-100 translate-x-0": visible, })}>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>{icons[type]}</div>
                    <div className="flex flex-col px-2.5">
                        <h4 className="font-semibold text-gray-800 dark:text-white">{message}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{description}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-700" onClick={handleClose}>
                    <TbEyeClosed className="size-5" size={18} />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
    );
};

export default Notification;