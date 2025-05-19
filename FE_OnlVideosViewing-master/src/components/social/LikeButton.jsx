import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toggleVideoLike, getVideoLikes } from '../../apis/socialApi';
import { toast } from 'react-toastify';
import AdvancedSearch from '../components/AdvancedSearch';
import VideoNotes from '../components/VideoNotes';
import VideoDownloader from '../components/VideoDownloader';

const LikeButton = ({ videoId }) => {
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const [userAction, setUserAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        fetchLikes();
    }, [videoId]);

    const fetchLikes = async () => {
        try {
            const response = await getVideoLikes(videoId);
            setLikeCount(response.likeCount);
            setDislikeCount(response.dislikeCount);
            setUserAction(response.userAction);
        } catch (error) {
            console.error('Failed to fetch likes:', error);
        }
    };

    const handleLike = async (type) => {
        if (!user) {
            toast.error('Please login to like/dislike videos');
            return;
        }

        try {
            setLoading(true);
            const response = await toggleVideoLike(videoId, type);
            setLikeCount(response.likeCount);
            setDislikeCount(response.dislikeCount);
            setUserAction(response.userAction);
        } catch (error) {
            toast.error('Failed to update like/dislike');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={() => handleLike('like')}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    userAction === 'like'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                </svg>
                <span>{likeCount}</span>
            </button>
            <button
                onClick={() => handleLike('dislike')}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    userAction === 'dislike'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    />
                </svg>
                <span>{dislikeCount}</span>
            </button>
        </div>
    );
};

export default LikeButton; 