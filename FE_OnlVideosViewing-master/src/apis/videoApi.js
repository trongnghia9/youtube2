import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const videoApi = {
  // Tìm kiếm video nâng cao
  advancedSearch: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/videos/search`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách video theo bộ lọc
  getFilteredVideos: async (filters) => {
    try {
      const response = await axios.get(`${API_URL}/videos/filter`, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tải xuống video
  downloadVideo: async (videoId, quality) => {
    try {
      const response = await axios.get(`${API_URL}/videos/${videoId}/download`, {
        params: { quality },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lưu ghi chú video
  saveVideoNote: async (videoId, note) => {
    try {
      const response = await axios.post(`${API_URL}/videos/${videoId}/notes`, note);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách ghi chú của video
  getVideoNotes: async (videoId) => {
    try {
      const response = await axios.get(`${API_URL}/videos/${videoId}/notes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xóa ghi chú video
  deleteVideoNote: async (videoId, noteId) => {
    try {
      const response = await axios.delete(`${API_URL}/videos/${videoId}/notes/${noteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật ghi chú video
  updateVideoNote: async (videoId, noteId, note) => {
    try {
      const response = await axios.put(`${API_URL}/videos/${videoId}/notes/${noteId}`, note);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
}; 