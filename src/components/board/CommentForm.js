// src/components/board/CommentForm.js
import React from 'react';
import styles from './CommentForm.module.scss';

const CommentForm = ({ newComment, setNewComment, handleCommentSubmit }) => {
    return (
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
    );
};

export default CommentForm;
