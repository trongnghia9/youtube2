import axios from 'axios';
import { API_URL } from '../config';

// Comment APIs
export const createComment = async (data) => {
    const response = await axios.post(`${API_URL}/api/social/comments`, data);
    return response.data;
};

export const getVideoComments = async (videoId, page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/api/social/videos/${videoId}/comments?page=${page}&limit=${limit}`);
    return response.data;
};

export const updateComment = async (commentId, data) => {
    const response = await axios.put(`${API_URL}/api/social/comments/${commentId}`, data);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await axios.delete(`${API_URL}/api/social/comments/${commentId}`);
    return response.data;
};

export const toggleCommentLike = async (commentId) => {
    const response = await axios.post(`${API_URL}/api/social/comments/${commentId}/like`);
    return response.data;
};

// Like APIs
export const toggleVideoLike = async (videoId, type) => {
    const response = await axios.post(`${API_URL}/api/social/videos/${videoId}/like`, { type });
    return response.data;
};

export const getVideoLikes = async (videoId) => {
    const response = await axios.get(`${API_URL}/api/social/videos/${videoId}/likes`);
    return response.data;
};

// Playlist APIs
export const createPlaylist = async (data) => {
    const response = await axios.post(`${API_URL}/api/social/playlists`, data);
    return response.data;
};

export const getUserPlaylists = async () => {
    const response = await axios.get(`${API_URL}/api/social/playlists`);
    return response.data;
};

export const getPlaylist = async (playlistId) => {
    const response = await axios.get(`${API_URL}/api/social/playlists/${playlistId}`);
    return response.data;
};

export const updatePlaylist = async (playlistId, data) => {
    const response = await axios.put(`${API_URL}/api/social/playlists/${playlistId}`, data);
    return response.data;
};

export const deletePlaylist = async (playlistId) => {
    const response = await axios.delete(`${API_URL}/api/social/playlists/${playlistId}`);
    return response.data;
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
    const response = await axios.post(`${API_URL}/api/social/playlists/${playlistId}/videos`, { videoId });
    return response.data;
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
    const response = await axios.delete(`${API_URL}/api/social/playlists/${playlistId}/videos/${videoId}`);
    return response.data;
}; 