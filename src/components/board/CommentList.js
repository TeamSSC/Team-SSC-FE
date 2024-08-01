// src/components/board/CommentList.js
import React from 'react';
import Comment from './Comment';
import styles from './CommentList.module.scss';

const CommentList = ({
                         comments,
                         formatDate,
                         toggleReplies,
                         expandedReplies,
                         replies,
                         toggleReplyForm,
                         replyContent,
                         setReplyContent,
                         handleReplySubmit,
                         replyFormVisible,
                         commentsLoading,
                         commentsError
                     }) => {
    return (
        <div className={styles.commentsSection}>
            {commentsLoading ? (
                <p>Loading comments...</p>
            ) : commentsError ? (
                <p>Error loading comments: {commentsError.message}</p>
            ) : (
                comments.map(comment => (
                    <Comment
                        key={comment.commentId}
                        comment={comment}
                        formatDate={formatDate}
                        toggleReplies={toggleReplies}
                        expandedReplies={expandedReplies}
                        replies={replies}
                        toggleReplyForm={toggleReplyForm}
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        handleReplySubmit={handleReplySubmit}
                        replyFormVisible={replyFormVisible}
                    />
                ))
            )}
        </div>
    );
};

export default CommentList;
