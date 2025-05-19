import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Form } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdvancedSearch = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (values) => {
    onSearch(values);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Form form={form} onFinish={handleSearch} layout="vertical">
        <div className="flex gap-4 items-end">
          <Form.Item name="search" className="flex-1 mb-0">
            <Input
              placeholder="Tìm kiếm video..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Form.Item>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Bộ lọc
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="category" label="Danh mục">
              <Select placeholder="Chọn danh mục">
                <Option value="music">Âm nhạc</Option>
                <Option value="education">Giáo dục</Option>
                <Option value="entertainment">Giải trí</Option>
                <Option value="sports">Thể thao</Option>
              </Select>
            </Form.Item>

            <Form.Item name="duration" label="Thời lượng">
              <Select placeholder="Chọn thời lượng">
                <Option value="short">Dưới 4 phút</Option>
                <Option value="medium">4-20 phút</Option>
                <Option value="long">Trên 20 phút</Option>
              </Select>
            </Form.Item>

            <Form.Item name="date" label="Ngày đăng">
              <DatePicker.RangePicker className="w-full" />
            </Form.Item>

            <Form.Item name="sort" label="Sắp xếp theo">
              <Select placeholder="Chọn cách sắp xếp">
                <Option value="newest">Mới nhất</Option>
                <Option value="popular">Phổ biến nhất</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
              </Select>
            </Form.Item>

            <Form.Item name="quality" label="Chất lượng">
              <Select placeholder="Chọn chất lượng">
                <Option value="all">Tất cả</Option>
                <Option value="hd">HD</Option>
                <Option value="4k">4K</Option>
              </Select>
            </Form.Item>

            <Form.Item className="flex items-end">
              <Button type="primary" htmlType="submit" className="w-full">
                Tìm kiếm
              </Button>
            </Form.Item>
          </div>
        )}
      </Form>
    </div>
  );
};

export default AdvancedSearch; 