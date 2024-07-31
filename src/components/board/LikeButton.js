// src/components/board/LikeButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faHeart as faHeartRegular } from '@fortawesome/free-solid-svg-icons';
import styles from './LikeButton.module.scss';

const LikeButton = ({ liked, likes, onLikeToggle }) => {
    return (
        <div className={styles.likes}>
            <FontAwesomeIcon
                icon={liked ? faHeartSolid : faHeartRegular}
                className={styles.heartIcon}
                onClick={onLikeToggle}
            />
            <span className={styles.likesCount}>{likes}</span>
        </div>
    );
};

export default LikeButton;
