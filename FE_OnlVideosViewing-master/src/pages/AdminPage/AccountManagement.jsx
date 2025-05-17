import React, { useContext, useState } from "react";
import { ThemeContext } from "../../services/ThemeContext";
import Dropdown from "../../components/StudioPage/Dropdown";
import { FaHome } from "react-icons/fa";
import { HiMiniSlash } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { LuUserRoundCheck, LuUsersRound } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { BiSlider } from "react-icons/bi";
import { MdOutlineBlock } from "react-icons/md";
import Search from "antd/es/input/Search";
import { Popconfirm, Table } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";

const AccountManagement = () => {

    const { theme } = useContext(ThemeContext);

    const cards = [
        { value: 236, title: "Total accounts", icon: <LuUsersRound className="size-5" /> },
        { value: 198, title: "Active accounts", icon: <LuUserRoundCheck className="size-5" /> },
        { value: 34, title: "Interactive accounts", icon: <TbBrandGoogleAnalytics className="size-5" /> },
    ];

    // Filter
    const optionFilter = [
        { value: 'Music' },
        { value: 'Film' },
        { value: 'Game' }
    ]

    const [valueFilter, setValueFilter] = useState(null);

    // Status
    const optionStatus = [
        { value: 'Active', icon: <LuUserRoundCheck className="size-4" /> },
        { value: 'Block', icon: <MdOutlineBlock className="size-4" /> },
    ]

    const [valueStatus, setValueStatus] = useState(null);

    // CSS Table
    const alignCenter = {
        onHeaderCell: () => ({
            style: {
                textAlign: 'center',
                fontSize: '12px',
                background: theme === "dark" ? "#1A2D42" : "#D4D8DD",
                color: theme === "dark" ? "#D4D8DD" : "#1A2D42",
            },
        }),
        onCell: () => ({
            style: {
                padding: '8px',
                textAlign: 'center',
                fontSize: '12.5px',
                fontWeight: '500',
                background: theme === "dark" ? "#1A2D42" : "#D4D8DD",
                color: theme === "dark" ? "#D4D8DD" : "#1A2D42",
            },
        }),
    };

    const confirmDelete = (e) => {
        console.log(e);
        message.success('Click on Yes');
    };
    const cancelDelete = (e) => {
        console.log(e);
        message.error('Click on No');
    };

    const columns = [
        {
            title: 'Name', width: 150, dataIndex: 'name', ...alignCenter, render: () => {
                return (
                    <div className="flex items-center justify-center gap-2.5">
                        <div className="w-1/3 flex justify-center">
                            <img src="https://img.youtube.com/vi/14vZDvYzgHyQR56AZBhb-7L3TtW-PQT9E/hqdefault.jpg" alt="img_name" className="size-14 object-cover rounded-full" />
                        </div>
                        <div className="w-2/3">
                            <p className="line-clamp-1">Truong Nguyen Viet Duc</p>
                        </div>
                    </div>
                )
            }
        },
        {
            title: 'Status', width: 100, dataIndex: 'status', key: 'status', ...alignCenter, render: (status) => {
                return (
                    <div className="flex items-center justify-center">
                        {status ?
                            <div className="flex items-center justify-center gap-1 w-1/2 bg-green-500 px-2 py-1.5 rounded">
                                <div className="w-1/4"><LuUserRoundCheck className="size-4 themeText" /></div> <p className="w-3/4 text-xs">Active</p>
                            </div>
                            :
                            <div className="flex items-center justify-center gap-1 w-1/2 bg-red-500 px-2 py-1.5 rounded">
                                <div className="w-1/4"><MdOutlineBlock className="size-4 themeText" /></div> <p className="w-3/4 text-xs">Block</p>
                            </div>
                        }
                    </div>
                )
            }
        },
        { title: 'Date created', width: 100, dataIndex: 'dateCreated', key: 'dateCreated', ...alignCenter },
        { title: 'Videos uploaded', width: 50, dataIndex: 'videosUploaded', key: 'videosUploaded', ...alignCenter },
        { title: 'Reported', width: 75, dataIndex: 'reported', key: 'reported', ...alignCenter },
        {
            width: 100, ...alignCenter, render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        {!record.status ?
                            <button className="py-1.5 px-2 text-xs rounded-md btn-1 bg-green-500 hover:bg-green-600">
                                <LuUserRoundCheck className="size-5" />
                            </button>
                            :
                            <button className="py-1.5 px-2 text-xs rounded-md btn-1 bg-red-500 hover:bg-red-600">
                                <MdOutlineBlock className="size-5" />
                            </button>
                        }
                        <Popconfirm
                            icon={<></>}
                            title={
                                <div className="flex items-center gap-1.5">
                                    <IoWarningOutline className="size-5 text-yellow-500" />
                                    <p className="text-xs">Delete Blog</p>
                                </div>
                            }
                            description={
                                <div className="w-11.75/12 mx-auto">
                                    <p className="text-xs">Are you sure you want to delete this blog?</p>
                                </div>
                            }
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            okText="Yes"
                            cancelText="No"
                            overlayClassName="custom-popconfirm"
                        >
                            <button className="btn-1 py-1.5 px-2 text-xs"><AiOutlineDelete className="size-5" /></button>
                        </Popconfirm>
                    </div>
                )
            }
        },
    ];

    const dataSource = Array.from({ length: 10 }).map((_, i) => ({
        key: i,
        blogId: i + 1,
        status: i % 2 === 0,
        dateCreated: `2023-02-${10 + (i % 20)}`,
        videosUploaded: Math.floor(Math.random() * 500),
        reported: Math.floor(Math.random() * 10000),
    }));

    return (
        <div className="py-4">
            <div className="p-2">
                <div className="flex items-center border-b-1.5 pt-1 pb-3 px-2.5">
                    <NavLink to={`/`} className="font-semibold flex items-center gap-1 hover:text-fourthColor"><FaHome className="size-5" /></NavLink>
                    <span> <HiMiniSlash className="size-5" /> </span>
                    <p className="text-sm font-semibold">Admin</p>
                    <span> <HiMiniSlash className="size-5" /> </span>
                    <p className="text-sm font-semibold">Accounts</p>
                </div>
                <div className="my-3.5 p-2.5 pb-3.5 flex flex-col gap-2.5 rounded-lg shadow-md shadow-slate-50">
                    <div className="">
                        <p className="text-xl font-semibold">Accounts</p>
                        <p className="text-sm font-normal">Manage user status and access</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {cards.map((card, index) => (
                            <div key={index} className="w-48 h-14 flex items-center gap-3.5 themeHeader p-3.5 rounded-lg shadow-md">
                                <div className="p-1.5 rounded-lg theme">
                                    {card.icon}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs themeText">{card.title}</p>
                                    <p className="text-sm font-semibold themeText">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between px-2.5">
                    <div className="w-1/3 flex items-center gap-4">
                        <div className="w-1/2">
                            <Dropdown
                                icon={<BiSlider className="w-4.5 h-4.5" />}
                                options={optionFilter}
                                selected={valueFilter}
                                setSelected={setValueFilter}
                                placeholder={
                                    <p className="text-sm font-semibold">Filter</p>
                                }
                            />
                        </div>
                        <div className="w-1/2">
                            <Dropdown
                                options={optionStatus}
                                selected={valueStatus}
                                setSelected={setValueStatus}
                                placeholder={
                                    <div className="">
                                        <p className="text-sm font-semibold">All Status</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                    <div className="w-1/4">
                        <Search placeholder="Search ..." allowClear size="medium" />
                    </div>
                </div>
                <div className="mx-2.5 my-3.5">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                        className="custom-table border themeBorderReserve"
                    />
                </div>
            </div>
        </div>
    );
}

export default AccountManagement;