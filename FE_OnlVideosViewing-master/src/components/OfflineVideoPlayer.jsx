import React, { useState, useEffect } from 'react';
import { getOfflineVideo } from '../services/offlineStorage';
import { message } from 'antd';

const OfflineVideoPlayer = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOfflineVideo();
  }, [videoId]);

  const loadOfflineVideo = async () => {
    try {
      const offlineVideo = await getOfflineVideo(videoId);
      
      if (!offlineVideo) {
        setError('Video not found in offline storage');
        return;
      }

      const { videoBlob, metadata } = offlineVideo;
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      setMetadata(metadata);
    } catch (error) {
      console.error('Error loading offline video:', error);
      setError('Failed to load offline video');
      message.error('Failed to load offline video');
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: revoke object URL when component unmounts
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!videoUrl) {
    return <div>Loading offline video...</div>;
  }

  return (
    <div className="w-full">
      {metadata && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{metadata.title}</h2>
          <p className="text-sm text-gray-500">
            Quality: {metadata.quality} | Size: {(metadata.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}
      <video
        controls
        className="w-full"
        src={videoUrl}
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default OfflineVideoPlayer; 