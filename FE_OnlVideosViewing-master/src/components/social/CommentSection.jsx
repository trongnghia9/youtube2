import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoComments, createComment, toggleCommentLike } from '../../apis/socialApi';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { toast } from 'react-toastify';

const CommentSection = ({ videoId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const user = useSelector(state => state.auth.user);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await getVideoComments(videoId, page);
            if (page === 1) {
                setComments(response.comments);
            } else {
                setComments(prev => [...prev, ...response.comments]);
            }
            setHasMore(response.currentPage < response.totalPages);
        } catch (error) {
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [videoId, page]);

    const handleCommentSubmit = async (content) => {
        try {
            const response = await createComment({
                content,
                videoId,
            });
            setComments(prev => [response, ...prev]);
            toast.success('Comment posted successfully');
        } catch (error) {
            toast.error('Failed to post comment');
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const response = await toggleCommentLike(commentId);
            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId ? response : comment
                )
            );
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            {user && (
                <CommentForm onSubmit={handleCommentSubmit} />
            )}
            <CommentList
                comments={comments}
                onLike={handleLikeComment}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
            />
        </div>
    );
};

export default CommentSection; 
 