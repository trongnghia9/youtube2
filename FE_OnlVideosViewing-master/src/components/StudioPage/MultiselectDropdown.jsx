import React, { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

const MultiselectDropdown = ({ options, selected, placeholder = "Search...", name, setFieldValue, isEditMode = false, editValues = [] }) => {
    const [search, setSearch] = useState('');
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(selected || []);
    const [active, setActive] = useState(false);
    const selectRef = useRef(null);

    const setOption = (value) => {
        let updatedOptions = [];
        if (selectedOptions.includes(value)) {
            updatedOptions = selectedOptions.filter(item => item !== value);
        } else {
            updatedOptions = [...selectedOptions, value];
        }

        setSelectedOptions(updatedOptions);
        if (setFieldValue && name) {
            setFieldValue(name, updatedOptions);
        }
    };

    useEffect(() => {
        const match = options.filter(item =>
            item?.label.toLowerCase().includes(search.toLowerCase())
        );
        setFilterOptions(match.length > 0 ? match : []);
    }, [search, options]);

    useEffect(() => {
        const closeHandler = (e) => {
            if (selectRef.current && !e.composedPath().includes(selectRef.current)) {
                setActive(false);
            }
        };
        document.addEventListener('click', closeHandler);
        return () => document.removeEventListener('click', closeHandler);
    }, []);

    return (
        <div className="relative rounded-md" ref={selectRef}>
            <div className="flex flex-col gap-2">
                {selectedOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm">
                        {selectedOptions.map((opt) => (
                            <div key={opt} className="flex items-center gap-1 px-2 py-1 rounded-full bg-thirdColor text-fifthColor">
                                <span className="text-xs">
                                    {options.find((o) => o.value === opt)?.label || opt}
                                </span>
                                <IoCloseSharp
                                    className="cursor-pointer hover:border-1.5 hover:border-fifthColor hover:text-fifthColor rounded-full duration-300"
                                    onClick={() => setOption(opt)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <input
                    type="text"
                    placeholder={placeholder}
                    className="py-1.5 px-3.5 text-sm w-full border-1.5 theme-first hover:theme-border duration-300 rounded-md focus:outline-none"
                    onClick={() => setActive(true)}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {isEditMode && editValues.length > 0 && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-600">
                        <p className="text-sm font-medium mb-1">Danh mục đã chọn:</p>
                        <ul className="flex flex-wrap gap-2">
                            {editValues.map((cat, idx) => (
                                <li key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-white text-xs">
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>
                )} 
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-10 w-full rounded-md border theme-first shadow-lg p-1.5 max-h-40 overflow-y-auto content-sidebar mt-1`}
                    >
                        {filterOptions.length > 0 ? (
                            filterOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center gap-2 hover:bg-thirdColor hover:text-fifthColor duration-300 cursor-pointer mb-1 p-2 rounded"
                                    onClick={() => setOption(option.value)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(option.value)}
                                        readOnly
                                    />
                                    <span className="text-sm">{option.label}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 px-2">No results found.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MultiselectDropdown;