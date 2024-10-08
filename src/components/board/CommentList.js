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
    commentsError,
    currentUser,
    fetchComments,
}) => {
    return (
        <div className={styles.commentsSection}>
            {commentsLoading ? (
                <p>Loading comments...</p>
            ) : commentsError ? (
                <p>댓글이 없습니다. 댓글을 달아보세요!</p>
            ) : (
                comments.map((comment) => (
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
                        currentUser={currentUser}
                        fetchComments={fetchComments}
                    />
                ))
            )}
        </div>
    );
};

export default CommentList;
