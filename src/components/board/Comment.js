// src/components/board/Comment.js
import React from 'react';
import styles from './Comment.module.scss';

const Comment = ({ comment, formatDate, toggleReplies, expandedReplies, replies, toggleReplyForm, replyContent, setReplyContent, handleReplySubmit, replyFormVisible }) => {
    return (
        <div className={styles.comment}>
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
    );
};

export default Comment;
