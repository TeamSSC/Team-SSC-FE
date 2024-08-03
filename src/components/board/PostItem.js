import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import styles from './PostItem.module.scss';
import {baseUrl} from "../../App"; // SCSS 모듈을 import

const PostItem = ({ post }) => {
    const [likeCount, setLikeCount] = useState(0);
    const API_LIKE_URL = `${baseUrl}/api/boards/${post.boardId}/like`;

    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                const response = await axios.get(API_LIKE_URL, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setLikeCount(response.data.data.likeCount);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLikeCount();
    }, [post.boardId]);

    return (
        <div className={styles.boardItem}>
            <span className={styles.boardTitle}>{post.title}</span>
            <div className={styles.boardDetails}>
                <span className={styles.boardAuthor}>{post.username}</span>
                <span className={styles.boardLikes}>
                    <FontAwesomeIcon icon={faHeart} className={styles.heartIcon} />
                    {likeCount}
                </span>
            </div>
        </div>
    );
};

export default PostItem;
