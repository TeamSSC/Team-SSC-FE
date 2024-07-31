import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faHeart as faHeartRegular } from '@fortawesome/free-solid-svg-icons';
import styles from './BoardDetail.module.scss';
import { baseUrl } from '../App';

const BoardDetail = () => {
    const { id } = useParams();
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
    const [replyFormVisible, setReplyFormVisible] = useState({}); // 답글 작성 폼 표시 상태

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

    const formatDate = (dateArray) => {
        const [year, month, day, hour, minute, second] = dateArray;
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    };

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
            // 답글 작성 후 해당 댓글의 답글을 새로 조회
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.boardDetailContainer}>
            <h1>{post.title}</h1>
            <div className={styles.postInfo}>
                <span>작성자: {post.username}</span>
                <span>작성일: {formatDate(post.createAt)}</span>
            </div>
            <p>{post.content}</p>
            <div className={styles.fileLinks}>
                {post.fileLinks.map((fileLink, index) => (
                    <div key={index} className={styles.fileLinkItem}>
                        <a href={fileLink} target="_blank" rel="noopener noreferrer">
                            <img src={fileLink} alt={`Attachment ${index + 1}`} />
                        </a>
                    </div>
                ))}
            </div>
            <div className={styles.likes}>
                <FontAwesomeIcon
                    icon={liked ? faHeartSolid : faHeartRegular}
                    className={styles.heartIcon}
                    onClick={handleLikeToggle}
                />
                <span className={styles.likesCount}>{likes}</span>
            </div>

            {/* 댓글 작성 폼 */}
            <div className={styles.commentFormContainer}>
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={styles.commentTextarea}
                        placeholder="댓글을 입력하세요..."
                    />
                    <button type="submit" className={styles.submitButton}>댓글 제출</button>
                </form>
            </div>

            {/* 댓글 섹션 */}
            <div className={styles.commentsSection}>
                {commentsLoading ? (
                    <p>Loading comments...</p>
                ) : commentsError ? (
                    <p>Error loading comments: {commentsError.message}</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.commentId} className={styles.comment}>
                            <p>
                                <strong>{comment.username}</strong>
                                <span className={styles.timestamp}>{formatDate(comment.createAt)}</span>
                            </p>
                            <p>{comment.content}</p>
                            {/* 답글 보기/접기 버튼 */}
                            {comment.reply && (
                                <div className={styles.replyToggle} onClick={() => toggleReplies(comment.commentId)}>
                                    <span className={styles.arrow} />
                                    {expandedReplies[comment.commentId] ? '답글 접기' : '답글 보기'}
                                </div>
                            )}
                            {/* 답글 목록 */}
                            {expandedReplies[comment.commentId] && replies[comment.commentId] && (
                                <div className={styles.replies}>
                                    {replies[comment.commentId].map(reply => (
                                        <div key={reply.commentId} className={styles.comment}>
                                            <p>
                                                <strong>{reply.username}</strong>
                                                <span className={styles.timestamp}>{formatDate(reply.createAt)}</span>
                                            </p>
                                            <p>{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* 답글 작성 버튼과 폼 */}
                            <div className={styles.replyFormContainer}>
                                <button
                                    onClick={() => toggleReplyForm(comment.commentId)}
                                    className={styles.toggleReplyFormButton}
                                >
                                    {replyFormVisible[comment.commentId] ? '답글 숨기기' : '답글 작성하기'}
                                </button>
                                {replyFormVisible[comment.commentId] && (
                                    <form
                                        onSubmit={(e) => handleReplySubmit(comment.commentId, e)}
                                        className={styles.replyForm}
                                    >
                                        <textarea
                                            value={replyContent[comment.commentId] || ''}
                                            onChange={(e) => setReplyContent(prev => ({
                                                ...prev,
                                                [comment.commentId]: e.target.value
                                            }))}
                                            className={styles.replyTextarea}
                                            placeholder="답글을 입력하세요..."
                                        />
                                        <button type="submit" className={styles.submitButton}>답글 제출</button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BoardDetail;
