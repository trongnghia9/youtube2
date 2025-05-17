import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const Dropdown = ({ options, selected, setSelected, placeholder, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isDropdownUpward, setIsDropdownUpward] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setIsDropdownUpward(spaceBelow < 150);
        }
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center justify-between gap-2 w-full rounded-md border theme pl-3.5 pr-2.5 py-1.5 text-sm"
                onClick={toggleDropdown}
            >
                <span className="flex items-center gap-2 font-medium">
                    {icon} {selected?.icon} {selected?.label || placeholder}
                </span>
                {isOpen ? (
                    <MdKeyboardArrowUp className="text-lg themeText" />
                ) : (
                    <MdKeyboardArrowDown className="text-lg themeText" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute ${isDropdownUpward ? "bottom-full mb-1" : "top-full mt-1"} 
                            w-full rounded-md z-50 border theme-first py-1 shadow-lg max-h-40 overflow-y-auto`}
                    >
                        {options.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                className="block w-11/12 mx-auto rounded text-left px-1.5 py-2 mb-0.5 text-sm 
                                hover:bg-thirdColor hover:text-fifthColor duration-300"
                                onClick={() => {
                                    setSelected(item);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    {item.icon} {item.label}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;