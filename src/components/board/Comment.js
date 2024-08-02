import React, { useState } from 'react';
import axios from 'axios';
import styles from './Comment.module.scss';
import CommentEditModal from './CommentEditModal';  // 모달 컴포넌트 import

const Comment = ({
                     comment,
                     formatDate,
                     toggleReplies,
                     expandedReplies,
                     replies,
                     toggleReplyForm,
                     replyContent,
                     setReplyContent,
                     handleReplySubmit,
                     replyFormVisible,
                     currentUser,
                     removeComment,  // 부모 컴포넌트에서 댓글 제거를 위한 함수
                     removeReply      // 부모 컴포넌트에서 답글 제거를 위한 함수
                 }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(comment.content);

    const [isReplyEditModalVisible, setIsReplyEditModalVisible] = useState({});
    const [updatedReplyContent, setUpdatedReplyContent] = useState({});

    const isAuthor = comment.username === currentUser;

    const handleUpdate = (newContent) => {
        setUpdatedContent(newContent);
    };

    const handleReplyUpdate = (commentId, newContent) => {
        setUpdatedReplyContent(prev => ({
            ...prev,
            [commentId]: newContent
        }));
    };

    const handleDelete = async (id, type) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                const token = localStorage.getItem('accessToken');
                await axios.delete(`http://localhost:8080/api/comments/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // 댓글 삭제 시
                if (type === 'comment') {
                    removeComment(id);
                }
                // 답글 삭제 시
                else if (type === 'reply') {
                    removeReply(id);
                }
            } catch (error) {
                console.error('Error deleting content:', error);
            }
        }
    };

    return (
        <div className={styles.comment}>
            <p>
                <strong>{comment.username}</strong>
                <span className={styles.timestamp}>{formatDate(comment.createAt)}</span>
            </p>
            <p>{updatedContent}</p>
            {isAuthor && (
                <div className={styles.commentActions}>
                    <button
                        className={styles.editButton}
                        onClick={() => setIsEditModalVisible(true)}
                    >
                        수정
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(comment.commentId, 'comment')}
                    >
                        삭제
                    </button>
                </div>
            )}
            {isEditModalVisible && (
                <CommentEditModal
                    id={comment.commentId}
                    initialContent={comment.content}
                    type="comment"
                    onClose={() => setIsEditModalVisible(false)}
                    onUpdate={handleUpdate}
                />
            )}
            {comment.reply && (
                <div className={styles.replyToggle} onClick={() => toggleReplies(comment.commentId)}>
                    <span className={styles.arrow} />
                    {expandedReplies[comment.commentId] ? '답글 접기' : '답글 보기'}
                </div>
            )}
            {expandedReplies[comment.commentId] && replies[comment.commentId] && (
                <div className={styles.replies}>
                    {replies[comment.commentId].map(reply => (
                        <div key={reply.commentId} className={styles.comment}>
                            <p>
                                <strong>{reply.username}</strong>
                                <span className={styles.timestamp}>{formatDate(reply.createAt)}</span>
                            </p>
                            <p>{updatedReplyContent[reply.commentId] || reply.content}</p>
                            {reply.username === currentUser && (
                                <div className={styles.commentActions}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => setIsReplyEditModalVisible(prev => ({
                                            ...prev,
                                            [reply.commentId]: true
                                        }))}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(reply.commentId, 'reply')}
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                            {isReplyEditModalVisible[reply.commentId] && (
                                <CommentEditModal
                                    id={reply.commentId}
                                    initialContent={reply.content}
                                    type="reply"
                                    onClose={() => setIsReplyEditModalVisible(prev => ({
                                        ...prev,
                                        [reply.commentId]: false
                                    }))}
                                    onUpdate={(newContent) => handleReplyUpdate(reply.commentId, newContent)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
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
    );
};

export default Comment;
