import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManagerModal.module.scss';
import Pagination from '../pagination/Pagination';

const ManagerModal = ({ onClose }) => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            axios.get('http://localhost:8080/api/users/signup/pend', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: currentPage
                }
            })
                .then(response => {
                    if (response.data.message === '회원가입 승인 대기자가 조회 되었습니다.') {
                        setPendingUsers(response.data.data.content);
                        setTotalPages(response.data.data.totalPages);
                    }
                })
                .catch(error => {
                    console.error('API 호출 오류:', error);
                });
        }
    }, [currentPage]);

    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage) {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    await axios.get('http://localhost:8080/api/users/signup/pend', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            page: newPage
                        }
                    });
                    setCurrentPage(newPage);
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error('잘못된 페이지 번호:', error);
                    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
                } else {
                    console.error('API 호출 오류:', error);
                }
            }
        }
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    const handleAction = async (action) => {
        const selectedUserIds = Object.keys(selectedUsers).filter(userId => selectedUsers[userId]);
        if (selectedUserIds.length > 0) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    for (let i = 0; i < selectedUserIds.length; i++) {
                        const userId = selectedUserIds[i];
                        await axios.patch(`http://localhost:8080/api/users/${action}/${userId}`, {}, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    }
                    alert(`${action === 'approve' ? '승인되었습니다.' : '거부되었습니다.'}`);
                    onClose(); // 모달 닫기
                } catch (error) {
                    console.error(`${action} 오류:`, error);
                    alert(`작업 중 오류가 발생했습니다: ${error.message}`);
                }
            } else {
                alert('로그인 토큰이 없습니다.');
            }
        } else {
            alert('선택된 유저가 없습니다.');
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.modalHeader}>
                    <button className={styles.modalButton}>
                        유저 상태 변경
                    </button>
                    <button className={styles.modalButton}>
                        알림 보내기
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <h2>회원가입 승인 대기자 목록</h2>
                    {pendingUsers.length > 0 ? (
                        <ul className={styles.userList}>
                            {pendingUsers.map(user => (
                                <li key={user.userId} className={styles.userItem}>
                                    <input
                                        type="checkbox"
                                        checked={!!selectedUsers[user.userId]}
                                        onChange={() => handleCheckboxChange(user.userId)}
                                        className={styles.checkbox}
                                    />
                                    <div className={styles.userInfo}>
                                        <p><strong>이메일:</strong> {user.email}</p>
                                        <p><strong>이름:</strong> {user.username}</p>
                                        <p><strong>가입일:</strong> {new Date(user.createAt[0], user.createAt[1] - 1, user.createAt[2], user.createAt[3], user.createAt[4], user.createAt[5]).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>대기자가 없습니다.</p>
                    )}
                    <Pagination
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.modalButton}
                            onClick={() => handleAction('approve')}
                        >
                            승인
                        </button>
                        <button
                            className={styles.modalButton}
                            onClick={() => handleAction('refusal')}
                        >
                            거부
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerModal;
