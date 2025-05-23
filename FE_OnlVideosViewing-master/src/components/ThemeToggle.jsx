import React from 'react';
import { Button, Tooltip } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Tooltip title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}>
            <Button
                type="text"
                icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{
                    color: isDarkMode ? '#fff' : '#000',
                    transition: 'all 0.3s ease'
                }}
            />
        </Tooltip>
    );
};

export default ThemeToggle; 