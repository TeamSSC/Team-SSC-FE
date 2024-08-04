import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import useAuthStore from '../stores/useAuthStore';
import styles from './KakaoApprovalStatus.module.scss'; // 스타일링 파일 경로를 확인하세요.
import Modal from 'react-modal'; // 모달 라이브러리 import

Modal.setAppElement('#root'); // Modal이 렌더링될 엘리먼트 지정

const KakaoApprovalStatus = () => {
    const [statusMessage, setStatusMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [periods, setPeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const accessToken = localStorage.getItem('accessToken'); // localStorage에서 accessToken을 가져옵니다.

    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/kakao/users/status`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const userData = response.data.data;
                if (userData.periodId === null) {
                    setStatusMessage('기수 신청이 필요합니다.');
                } else {
                    setStatusMessage(
                        `${userData.trackName} ${userData.period}기 신청 중입니다. 해당 트랙 승인 대기중입니다.`
                    );
                }
            } catch (err) {
                console.error(err);
                setStatusMessage('유저 상태를 가져오는 중 오류가 발생했습니다.');
            }
        };

        if (accessToken) {
            fetchUserStatus();
        } else {
            setStatusMessage('로그인이 필요합니다.');
        }
    }, [accessToken]);

    const openModal = () => {
        fetchPeriods();
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const fetchPeriods = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/periods`);
            setPeriods(response.data.data);
        } catch (err) {
            console.error(err);
            alert('기수 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handleApply = async () => {
        try {
            await axios.patch(
                `${baseUrl}/api/kakao/users/periods/${selectedPeriod}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            alert('신청이 완료되었습니다.');
            closeModal();
            window.location.reload(); // 페이지 새로고침
        } catch (err) {
            console.error(err);
            alert('기수 신청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.statusWrapper}>
            <h1>유저 승인 상태</h1>
            <p>{statusMessage}</p>
            {statusMessage === '기수 신청이 필요합니다.' && (
                <button onClick={openModal} className={styles.applyButton}>
                    기수 신청하기
                </button>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="기수 신청"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <button onClick={closeModal} className={styles.closeButton}>
                    &times; {/* 닫기 버튼의 X 문자 */}
                </button>
                <h2>기수 신청</h2>
                <div className={styles.modalContent}>
                    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                        <option value="">선택하세요</option>
                        {periods.map((period) => (
                            <option key={period.id} value={period.id}>
                                {period.trackName} {period.period}기
                            </option>
                        ))}
                    </select>
                    <button onClick={handleApply} className={styles.submitButton}>
                        신청하기
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default KakaoApprovalStatus;
