import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Select, Progress, message } from 'antd';
import { DownloadOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { saveVideoOffline, isVideoOffline, deleteOfflineVideo } from '../../services/offlineStorage';

const { Option } = Select;

const VideoDownloader = ({ videoId, videoTitle, videoUrl }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const qualityOptions = [
    { value: '1080p', label: '1080p - Full HD', size: '~500MB' },
    { value: '720p', label: '720p - HD', size: '~250MB' },
    { value: '480p', label: '480p - SD', size: '~150MB' },
    { value: '360p', label: '360p', size: '~100MB' },
  ];

  useEffect(() => {
    checkOfflineStatus();
  }, [videoId]);

  const checkOfflineStatus = async () => {
    try {
      const offline = await isVideoOffline(videoId);
      setIsOffline(offline);
    } catch (error) {
      console.error('Error checking offline status:', error);
      message.error('Failed to check offline status');
    }
  };

  const checkStorageQuota = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const {usage, quota} = await navigator.storage.estimate();
        const availableSpace = quota - usage;
        const requiredSpace = getQualitySize(selectedQuality);
        
        if (availableSpace < requiredSpace) {
          throw new Error('Not enough storage space available');
        }
        return true;
      } catch (error) {
        message.error('Not enough storage space available');
        return false;
      }
    }
    return true; // If storage API not available, proceed anyway
  };

  const getQualitySize = (quality) => {
    const option = qualityOptions.find(opt => opt.value === quality);
    if (!option) return 0;
    return parseInt(option.size.replace(/[^0-9]/g, '')) * 1024 * 1024; // Convert to bytes
  };

  const handleDownload = async () => {
    if (!videoUrl) {
      message.error('Video URL is not available');
      return;
    }

    try {
      // Check storage quota first
      const hasSpace = await checkStorageQuota();
      if (!hasSpace) return;

      setIsDownloading(true);
      setDownloadProgress(0);
      setError(null);

      // Create new AbortController for this download
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Get the video URL based on quality
      const videoUrlWithQuality = `${videoUrl}?quality=${selectedQuality}`;
      
      // Fetch the video
      const response = await fetch(videoUrlWithQuality, { signal });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length');

      if (!contentLength) {
        throw new Error('Content length not available');
      }

      let receivedLength = 0;
      const chunks = [];

      while(true) {
        const {done, value} = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        receivedLength += value.length;
        setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
      }

      // Combine chunks into a single Uint8Array
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      // Create blob from chunks
      const blob = new Blob([chunksAll], { type: 'video/mp4' });

      // Save to IndexedDB
      const metadata = {
        title: videoTitle,
        quality: selectedQuality,
        size: contentLength,
        duration: 0, // Will be updated when video is played
        thumbnail: '', // Will be updated when video is played
      };

      await saveVideoOffline(videoId, blob, metadata);
      setIsOffline(true);
      message.success('Video downloaded successfully!');
      setIsModalVisible(false);

    } catch (error) {
      if (error.name === 'AbortError') {
        message.info('Download cancelled');
      } else {
        console.error('Download error:', error);
        setError(error.message);
        message.error(`Failed to download video: ${error.message}`);
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleDeleteOffline = async () => {
    try {
      await deleteOfflineVideo(videoId);
      setIsOffline(false);
      message.success('Offline video deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete offline video');
    }
  };

  const handleCloseModal = () => {
    if (isDownloading) {
      Modal.confirm({
        title: 'Cancel Download?',
        content: 'Are you sure you want to cancel the download?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          handleCancelDownload();
          setIsModalVisible(false);
        }
      });
    } else {
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={isOffline ? <DeleteOutlined /> : <DownloadOutlined />}
        onClick={() => isOffline ? handleDeleteOffline() : setIsModalVisible(true)}
      >
        {isOffline ? 'Delete Offline' : 'Download'}
      </Button>

      <Modal
        title="Download Video"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="cancel"
            onClick={handleCloseModal}
            disabled={isDownloading}
          >
            Cancel
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={isDownloading ? <LoadingOutlined /> : <DownloadOutlined />}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Video Quality
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
                Downloading... Please do not close this window
              </p>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm">
              Error: {error}
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>Note:</p>
            <ul className="list-disc list-inside">
              <li>Video will be downloaded in selected quality</li>
              <li>Download time depends on video size and network speed</li>
              <li>Video will be available offline after download</li>
              <li>Video is for personal use only</li>
              <li>Make sure you have enough storage space</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VideoDownloader; 