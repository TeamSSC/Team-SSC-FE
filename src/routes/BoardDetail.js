// src/routes/BoardDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostHeader from '../components/board/PostHeader';
import FileLinks from '../components/board/FileLinks';
import LikeButton from '../components/board/LikeButton';
import CommentForm from '../components/board/CommentForm';
import CommentList from '../components/board/CommentList';
import styles from './BoardDetail.module.scss';
import { baseUrl } from '../App';
import useAuthStore from '../stores/useAuthStore';

const BoardDetail = () => {
    const { id } = useParams();
    const authData = useAuthStore(state => ({
        isLoggedIn: state.isLoggedIn,
        username: state.username
    }));
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentsError, setCommentsError] = useState(null);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replies, setReplies] = useState({});
    const [newComment, setNewComment] = useState('');
    const [replyContent, setReplyContent] = useState({});
    const [replyFormVisible, setReplyFormVisible] = useState({});

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/boards/${id}`);
                setPost(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchLikes = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/boards/${id}/like`);
                setLikes(response.data.data.likeCount);
                setLiked(response.data.data.userLiked);
            } catch (err) {
                console.error(err);
                setError(err);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/boards/${id}/comments`);
                setComments(response.data.data.content);
            } catch (err) {
                setCommentsError(err);
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchPost();
        fetchLikes();
        fetchComments();
    }, [id]);

    const handleLikeToggle = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`${baseUrl}/api/boards/${id}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const response = await axios.get(`${baseUrl}/api/boards/${id}/like`);
            setLikes(response.data.data.likeCount);
            setLiked(response.data.data.userLiked);
        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    const fetchReplies = async (commentId) => {
        try {
            const response = await axios.get(`${baseUrl}/api/comments/${commentId}`);
            setReplies(prevReplies => ({
                ...prevReplies,
                [commentId]: response.data.data.content
            }));
        } catch (err) {
            console.error(err);
            setCommentsError(err);
        }
    };

    const toggleReplies = async (commentId) => {
        if (!expandedReplies[commentId]) {
            await fetchReplies(commentId);
        }
        setExpandedReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`${baseUrl}/api/boards/${id}/comment`, { content: newComment }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNewComment('');
            const response = await axios.get(`${baseUrl}/api/boards/${id}/comments`);
            setComments(response.data.data.content);
        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    const handleReplySubmit = async (parentCommentId, e) => {
        e.preventDefault();
        if (!replyContent[parentCommentId]?.trim()) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`${baseUrl}/api/boards/${id}/comment`, {
                content: replyContent[parentCommentId],
                parentCommentId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setReplyContent(prev => ({
                ...prev,
                [parentCommentId]: ''
            }));
            await fetchReplies(parentCommentId);
        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    const toggleReplyForm = (commentId) => {
        setReplyFormVisible(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const formatDate = (dateArray) => {
        const [year, month, day, hour, minute, second] = dateArray;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.boardDetailContainer}>
            {post && (
                <>
                    <PostHeader
                        title={post.title}
                        username={post.username}
                        createdAt={formatDate(post.createAt)}
                        content={post.content}
                        isAuthor={authData?.username === post.username}
                        initialImages={post.fileLinks}
                    />
                    <div className={styles.postContent}>
                        <p>{post.content}</p>
                    </div>
                    <FileLinks fileLinks={post.fileLinks} />
                    <LikeButton
                        liked={liked}
                        likes={likes}
                        onLikeToggle={handleLikeToggle}
                    />
                    <CommentForm
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleCommentSubmit={handleCommentSubmit}
                    />
                    <CommentList
                        comments={comments}
                        formatDate={formatDate}
                        toggleReplies={toggleReplies}
                        expandedReplies={expandedReplies}
                        replies={replies}
                        toggleReplyForm={toggleReplyForm}
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        handleReplySubmit={handleReplySubmit}
                        replyFormVisible={replyFormVisible}
                        commentsLoading={commentsLoading}
                        commentsError={commentsError}
                        currentUser={authData?.username}  // currentUser 전달
                    />
                </>
            )}
        </div>
    );
};

export default BoardDetail;
