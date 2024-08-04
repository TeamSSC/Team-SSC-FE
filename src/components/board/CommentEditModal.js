// src/components/board/CommentEditModal.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './CommentEditModal.module.scss';
import { baseUrl } from '../../config';

const CommentEditModal = ({ id, initialContent, type, onClose, onUpdate }) => {
    const [content, setContent] = useState(initialContent);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(
                `${baseUrl}/api/comments/${id}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdate(content);
            onClose();
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{type === 'comment' ? '댓글 수정' : '답글 수정'}</h2>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.textarea}
                    placeholder="수정할 내용을 입력하세요..."
                />
                <div className={styles.modalActions}>
                    <button onClick={handleUpdate} className={styles.updateButton}>
                        수정하기
                    </button>
                    <button onClick={onClose} className={styles.closeButton}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentEditModal;
