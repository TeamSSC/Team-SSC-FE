import { useState } from 'react';
import axios from 'axios';
import styles from './PeriodModal.module.scss';
import {baseUrl} from "../../config"; // 스타일은 필요에 따라 추가하세요.

const PeriodModal = ({ closeModal, periodId, getTrackPeriods }) => {
    const [userEmail, setUserEmail] = useState('');

    const handleAssignManager = async () => {
        try {
            await axios.post(`${baseUrl}/api/users/period/manager`, {
                userEmail: userEmail,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            alert('매니저가 성공적으로 설정되었습니다.');
            getTrackPeriods(); // 새로고침
            closeModal(); // 모달 닫기
        } catch (err) {
            console.error(err);
            alert('매니저 설정에 실패했습니다.');
        }
    };

    return (
        <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>X</button>
            <h2>매니저 설정</h2>
            <input
                className={styles.input}
                type="email"
                placeholder="이메일을 입력하세요..."
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
            <button className={styles.button} onClick={handleAssignManager}>완료</button>
        </div>
    );
};

export default PeriodModal;
