import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // 모달 패키지 import
import { baseUrl } from '../App'; // baseUrl을 '../App'에서 가져옴

const Period = () => {
    const [data, setData] = useState([]); // 기수 목록 상태
    const [selectedPeriods, setSelectedPeriods] = useState([]); // 선택된 기수 상태
    const [users, setUsers] = useState([]); // 유저 목록 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [userStatuses, setUserStatuses] = useState({}); // 유저 상태 변경 기록
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        getPeriodListHook(); // 컴포넌트 마운트 시 전체 기수 목록 가져옴
    }, []);

    // 전체 기수 목록 조회
    const getPeriodListHook = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/periods`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // 응답 데이터 로그 출력
            console.log('Response data:', response.data);

            // 응답 데이터가 예상한 형태로 오는지 확인
            if (response.data && response.data.data) {
                setData(response.data.data);
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (err) {
            console.error('Failed to fetch period list:', err);
        }
    };

    // 유저 목록 조회
    const getUserList = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('User data:', response.data);

            if (response.data && response.data.data) {
                setUsers(response.data.data);
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (err) {
            console.error('Failed to fetch user list:', err);
        }
    };

    // 유저 상태 변경 모달 열기
    const openModal = () => {
        getUserList(); // 모달을 열기 전에 유저 목록을 가져옴
        setIsModalOpen(true);
    };

    // 유저 상태 변경 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 유저 상태 변경 처리`
    const handleStatusChange = (userId, newStatus) => {
        setUserStatuses((prevStatuses) => ({
            ...prevStatuses,
            [userId]: newStatus,
        }));
    };

    // 상태 변경 내용 서버에 전송
    const confirmStatusChanges = async () => {
        try {
            const promises = Object.entries(userStatuses).map(([userId, newStatus]) =>
                axios.patch(
                    `${baseUrl}/api/users/${userId}`,
                    { status: newStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            );
            await Promise.all(promises);
            alert('유저 상태 변경이 완료되었습니다.');
            closeModal(); // 모달 닫기
            getUserList(); // 유저 목록 갱신
        } catch (err) {
            console.error('Failed to update user statuses:', err);
        }
    };

    // 체크박스 선택/해제 토글
    const toggleSelectPeriod = (periodId) => {
        setSelectedPeriods((prevSelected) => {
            if (prevSelected.includes(periodId)) {
                // 이미 선택된 경우, 선택 해제
                return prevSelected.filter((id) => id !== periodId);
            } else {
                // 선택되지 않은 경우, 선택 추가
                return [...prevSelected, periodId];
            }
        });
    };

    // 승인하기 버튼 클릭 시 처리
    const approvePeriods = async () => {
        try {
            const promises = selectedPeriods.map((periodId) =>
                axios.patch(
                    `${baseUrl}/api/periods/${periodId}`,
                    { status: 'APPROVED' },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            );
            await Promise.all(promises);
            alert('승인이 완료되었습니다.');
            getPeriodListHook(); // 승인 후 목록을 새로고침
        } catch (err) {
            console.error('Failed to approve periods:', err);
        }
    };

    // 거부하기 버튼 클릭 시 처리
    const rejectPeriods = async () => {
        try {
            const promises = selectedPeriods.map((periodId) =>
                axios.patch(
                    `${baseUrl}/api/periods/${periodId}`,
                    { status: 'REJECTED' },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            );
            await Promise.all(promises);
            alert('거부가 완료되었습니다.');
            getPeriodListHook(); // 거부 후 목록을 새로고침
        } catch (err) {
            console.error('Failed to reject periods:', err);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.buttonContainer}>
                <button style={styles.topButton} onClick={openModal}>
                    유저 상태변경
                </button>
                <button style={styles.topButton}>알림보내기</button>
            </div>

            <h1 style={styles.title}>회원가입 승인 대기자 목록</h1>

            <ul style={styles.list}>
                {data.map((period) => (
                    <li key={period.id} style={styles.listItem}>
                        <input
                            type="checkbox"
                            checked={selectedPeriods.includes(period.id)}
                            onChange={() => toggleSelectPeriod(period.id)}
                            style={styles.checkbox}
                        />
                        <span style={styles.periodName}>{period.name}</span>
                    </li>
                ))}
            </ul>

            <div style={styles.actionButtonContainer}>
                <button style={styles.actionButton} onClick={rejectPeriods}>
                    거부하기
                </button>
                <button style={styles.actionButton} onClick={approvePeriods}>
                    승인하기
                </button>
            </div>

            {/* 유저 상태 변경 모달 */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="유저 상태 변경" style={modalStyles}>
                <h2 style={styles.modalTitle}>유저 상태 변경</h2>
                <ul style={styles.list}>
                    {users.map((user) => (
                        <li key={user.id} style={styles.listItem}>
                            <span style={styles.userName}>{user.name}</span>
                            <select
                                value={userStatuses[user.id] || user.status}
                                onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                style={styles.select}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                        </li>
                    ))}
                </ul>
                <button style={styles.confirmButton} onClick={confirmStatusChanges}>
                    확인
                </button>
            </Modal>
        </div>
    );
};

// 스타일 객체
const styles = {
    container: {
        backgroundColor: '#e3c6ff',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '400px',
        margin: '0 auto',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    topButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#8c4fff',
        color: '#fff',
        padding: '10px',
        marginBottom: '5px',
        borderRadius: '5px',
    },
    checkbox: {
        marginRight: '10px',
    },
    periodName: {
        flexGrow: 1,
    },
    userName: {
        flexGrow: 1,
        marginRight: '10px',
    },
    select: {
        padding: '5px',
        borderRadius: '5px',
    },
    actionButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    actionButton: {
        backgroundColor: '#fff',
        color: '#333',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        flexGrow: 1,
        marginLeft: '10px',
    },
    modalTitle: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    confirmButton: {
        backgroundColor: '#8c4fff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto',
    },
};

// 모달 스타일 객체
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#e3c6ff',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '90%',
    },
};

export default Period;
