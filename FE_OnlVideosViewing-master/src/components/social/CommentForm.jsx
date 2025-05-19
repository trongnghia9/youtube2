import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CommentForm = ({ onSubmit, initialValue = '', placeholder = 'Add a comment...' }) => {
    const [content, setContent] = useState(initialValue);
    const user = useSelector(state => state.auth.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content);
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex items-start space-x-3">
                <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="2"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Comment
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CommentForm; 