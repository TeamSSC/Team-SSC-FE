// src/components/board/PostHeader.js
import React from 'react';
import styles from './PostHeader.module.scss';

const PostHeader = ({ title, username, createAt }) => {
    return (
        <div className={styles.postHeader}>
            <h1>{title}</h1>
            <div className={styles.postInfo}>
                <span>작성자: {username}</span>
                <span>작성일: {formatDate(createAt)}</span>
            </div>
        </div>
    );
};

const formatDate = (dateArray) => {
    const [year, month, day, hour, minute, second] = dateArray;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
};

export default PostHeader;
