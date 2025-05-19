import React, { useState } from 'react';
import { Button, Modal, Select, Progress, message } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;

const VideoDownloader = ({ videoId, videoTitle }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const qualityOptions = [
    { value: '1080p', label: '1080p - Full HD', size: '~500MB' },
    { value: '720p', label: '720p - HD', size: '~250MB' },
    { value: '480p', label: '480p - SD', size: '~150MB' },
    { value: '360p', label: '360p', size: '~100MB' },
  ];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Here you would make an actual API call to your backend
      // const response = await fetch(`/api/videos/${videoId}/download?quality=${selectedQuality}`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `${videoTitle}-${selectedQuality}.mp4`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // window.URL.revokeObjectURL(url);

      // Simulate download completion
      setTimeout(() => {
        clearInterval(interval);
        setDownloadProgress(100);
        setIsDownloading(false);
        message.success('Tải xuống hoàn tất!');
        setIsModalVisible(false);
      }, 5000);

    } catch (error) {
      message.error('Có lỗi xảy ra khi tải xuống video');
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Tải xuống
      </Button>

      <Modal
        title="Tải xuống video"
        open={isModalVisible}
        onCancel={() => !isDownloading && setIsModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsModalVisible(false)}
            disabled={isDownloading}
          >
            Hủy
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={isDownloading ? <LoadingOutlined /> : <DownloadOutlined />}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Đang tải xuống...' : 'Tải xuống'}
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn chất lượng video
            </label>
            <Select
              value={selectedQuality}
              onChange={setSelectedQuality}
              className="w-full"
              disabled={isDownloading}
            >
              {qualityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label} ({option.size})
                </Option>
              ))}
            </Select>
          </div>

          {isDownloading && (
            <div>
              <Progress percent={downloadProgress} status="active" />
              <p className="text-sm text-gray-500 mt-2">
                Đang tải xuống... Vui lòng không đóng cửa sổ này
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>Lưu ý:</p>
            <ul className="list-disc list-inside">
              <li>Video sẽ được tải xuống với chất lượng đã chọn</li>
              <li>Thời gian tải xuống phụ thuộc vào kích thước video và tốc độ mạng</li>
              <li>Video chỉ được tải xuống cho mục đích cá nhân</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VideoDownloader; 