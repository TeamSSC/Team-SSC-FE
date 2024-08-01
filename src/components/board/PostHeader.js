// src/components/board/PostHeader.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PostHeader.module.scss';

const PostHeader = ({ title, username, createdAt, content, isAuthor, initialImages }) => {
    const { id: boardId } = useParams(); // URL에서 boardId를 추출
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleEdit = (updatedData) => {
        const token = localStorage.getItem('accessToken'); // 실제 액세스 토큰으로 교체
        fetch(`http://localhost:8080/api/boards/${boardId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data' // Remove this line
            },
            body: updatedData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('수정되었습니다.'); // 알림 표시
                window.location.reload(); // 페이지 새로 고침
                closeEditModal();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleDelete = () => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            const token = localStorage.getItem('accessToken'); // 실제 액세스 토큰으로 교체
            fetch(`http://localhost:8080/api/boards/${boardId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    alert('게시글이 삭제되었습니다.'); // 알림 표시
                    window.location.href = '/boards'; // 홈 페이지로 리다이렉트
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div className={styles.postHeader}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>{title}</h1>
                {isAuthor && (
                    <div className={styles.authorActions}>
                        <button className={styles.editButton} onClick={openEditModal}>수정</button>
                        <button className={styles.deleteButton} onClick={handleDelete}>삭제</button>
                    </div>
                )}
            </div>
            <p>
                <strong>{username}</strong> 작성일: {createdAt}
            </p>
            {isEditModalOpen && (
                <EditModal
                    initialData={{ title, content: content, images: initialImages }}
                    onSave={handleEdit}
                    onCancel={closeEditModal}
                />
            )}
        </div>
    );
};

const EditModal = ({ initialData, onSave, onCancel }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [content, setContent] = useState(initialData.content || '');
    const [images, setImages] = useState(initialData.images || []);
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const handleImageClick = (url) => {
        setImagesToDelete(prev => {
            if (prev.includes(url)) {
                return prev.filter(imageUrl => imageUrl !== url);
            } else {
                return [...prev, url];
            }
        });
    };

    const handleFileChange = (event) => {
        setNewImages([...newImages, ...Array.from(event.target.files)]);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        imagesToDelete.forEach((url) => {
            formData.append('deleteImagesLink', url);
        });

        newImages.forEach((image) => {
            formData.append('uploadImages', image);
        });

        onSave(formData);
    };

    return (
        <div className={styles.modal}>
            <h2>게시물 수정</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
            />
            <div className={styles.imageList}>
                <p>삭제할 이미지를 선택하세요:</p> {/* 문구 추가 */}
                {images.length > 0 ? (
                    images.map((url, index) => (
                        <div
                            className={`${styles.imageItem} ${imagesToDelete.includes(url) ? styles.selected : ''}`}
                            key={index}
                            onClick={() => handleImageClick(url)}
                        >
                            <img src={url} alt={`uploaded ${index}`} onError={(e) => e.target.src = '/default-image.png'} />
                        </div>
                    ))
                ) : (
                    <p>이미지가 없습니다.</p>
                )}
            </div>
            <input
                type="file"
                multiple
                onChange={handleFileChange}
            />
            <div>
                <button onClick={handleSave}>저장</button>
                <button onClick={onCancel}>취소</button>
            </div>
        </div>
    );
};

export default PostHeader;
