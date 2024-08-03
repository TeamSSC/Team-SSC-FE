import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManagerModal.module.scss';
import Pagination from '../pagination/Pagination';
import useAuthStore from '../../stores/useAuthStore';
import {baseUrl} from "../../App";

const ManagerModal = ({ onClose }) => {
    const authData = useAuthStore();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [isCreatePeriodModalOpen, setIsCreatePeriodModalOpen] = useState(false);
    const [newPeriodName, setNewPeriodName] = useState('');
    const [isChangePeriodStatusModalOpen, setIsChangePeriodStatusModalOpen] = useState(false);
    const [weeks, setWeeks] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loadingPeriods, setLoadingPeriods] = useState(true);

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/users/signup/pend`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    params: {
                        page: currentPage
                    }
                });
                if (response.data.message === '회원가입 승인 대기자가 조회 되었습니다.') {
                    setPendingUsers(response.data.data.content);
                    setTotalPages(response.data.data.totalPages);
                }
            } catch (error) {
                console.error('회원가입 대기자 조회 오류:', error);
            }
        };

        fetchPendingUsers();
    }, [currentPage]);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/weekProgress/myweekProgress`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const weekData = response.data.data.map(week => ({
                    id: week.id,
                    name: week.name,
                    status: getStatusLabel(week.status)
                }));
                setWeeks(weekData);
                setSelectedPeriod(weekData[0]?.id || '');
                setLoadingPeriods(false);
            } catch (error) {
                console.error('주차 목록 조회 오류:', error);
                setLoadingPeriods(false);
            }
        };

        fetchWeeks();
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PLANNED':
                return '진행 예정';
            case 'ONGOING':
                return '현재 주차';
            case 'COMPLETED':
                return '지난 주차';
            default:
                return '알 수 없음';
        }
    };

    const handlePageChange = async (newPage) => {
        if (newPage > 0 && newPage) {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    await axios.get(`${baseUrl}/api/users/signup/pend`, {
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
                        await axios.patch(`${baseUrl}/api/users/${action}/${userId}`, {}, {
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

    const openCreatePeriodModal = () => {
        setIsCreatePeriodModalOpen(true);
    };

    const closeCreatePeriodModal = () => {
        setIsCreatePeriodModalOpen(false);
        setNewPeriodName(''); // 모달 닫을 때 입력 필드 초기화
    };

    const handleCreatePeriod = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await axios.post(`${baseUrl}/api/weekProgress`, {
                    name: newPeriodName
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('주차가 생성되었습니다.');
                closeCreatePeriodModal(); // 모달 닫기
            } catch (error) {
                console.error('주차 생성 오류:', error);
                alert('주차 생성 중 오류가 발생했습니다.');
            }
        } else {
            alert('로그인 토큰이 없습니다.');
        }
    };

    const openChangePeriodStatusModal = () => {
        setIsChangePeriodStatusModalOpen(true);
    };

    const closeChangePeriodStatusModal = () => {
        setIsChangePeriodStatusModalOpen(false);
        setSelectedPeriod('');
        setSelectedStatus('');
    };

    const handleChangePeriodStatus = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await axios.patch(`${baseUrl}/api/weekProgress/${selectedPeriod}`, {
                    status: selectedStatus
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('주차 상태가 변경되었습니다.');
                closeChangePeriodStatusModal();
                window.location.reload();
            } catch (error) {
                console.error('주차 상태 변경 오류:', error);
                alert('주차 상태 변경 중 오류가 발생했습니다.');
            }
        } else {
            alert('로그인 토큰이 없습니다.');
        }
    };

    if (loadingPeriods) return <p>Loading...</p>;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.modalHeader}>
                    <button className={styles.modalButton} onClick={() => handleAction('notify')}>
                        알림 보내기
                    </button>
                    <button className={`${styles.modalButton} ${styles.createPeriod}`} onClick={openCreatePeriodModal}>
                        주차 생성
                    </button>
                    <button className={`${styles.modalButton} ${styles.periodStatusChange}`} onClick={openChangePeriodStatusModal}>
                        주차 상태 변경
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
                            className={`${styles.modalButton} ${styles.actionButton}`}
                            onClick={() => handleAction('approve')}
                        >
                            승인
                        </button>
                        <button
                            className={`${styles.modalButton} ${styles.actionButton}`}
                            onClick={() => handleAction('reject')}
                        >
                            거부
                        </button>
                    </div>
                </div>
                {isCreatePeriodModalOpen && (
                    <div className={styles.createPeriodOverlay} onClick={closeCreatePeriodModal}>
                        <div className={styles.createPeriodContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={closeCreatePeriodModal}>X</button>
                            <h2>주차 생성</h2>
                            <input
                                type="text"
                                value={newPeriodName}
                                onChange={(e) => setNewPeriodName(e.target.value)}
                                placeholder="주차 이름"
                                className={styles.input}
                            />
                            <button
                                className={`${styles.modalButton} ${styles.createPeriodButton}`}
                                onClick={handleCreatePeriod}
                            >
                                생성
                            </button>
                        </div>
                    </div>
                )}
                {isChangePeriodStatusModalOpen && (
                    <div className={styles.changePeriodStatusOverlay} onClick={closeChangePeriodStatusModal}>
                        <div className={styles.changePeriodStatusContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={closeChangePeriodStatusModal}>X</button>
                            <h2>주차 상태 변경</h2>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className={styles.select}
                            >
                                <option value="" disabled>주차를 선택하세요</option>
                                {weeks.map(week => (
                                    <option key={week.id} value={week.id}>
                                        {week.name} ({week.status})
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className={styles.select}
                            >
                                <option value="" disabled>상태를 선택하세요</option>
                                <option value="PLANNED">진행 예정</option>
                                <option value="ONGOING">현재 주차</option>
                                <option value="COMPLETED">지난 주차</option>
                            </select>
                            <button
                                className={`${styles.modalButton} ${styles.changePeriodStatusButton}`}
                                onClick={handleChangePeriodStatus}
                            >
                                변경
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerModal;
