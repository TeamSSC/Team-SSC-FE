import { useState } from 'react';
import styles from '../admin/CreateTrack.module.scss';
import { baseUrl } from '../../config';
import axios from 'axios';

const UpdatePeriod = ({ closeModal, periodId }) => {
    const [period, setPeriod] = useState(null);
    console.log('periodId', periodId);

    const token = localStorage.getItem('accessToken');

    const updatePeriod = async () => {
        try {
            const response = await axios.patch(
                `${baseUrl}/api/periods/${periodId}`,
                { period: period },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.createTrack_wrapper}>
            <h1>기수 수정</h1>
            <input placeholder="수정할 기수의 숫자를 입력하세요..." onChange={(e) => setPeriod(e.target.value)}></input>
            <div className={styles.createTrack_button_wrapper}>
                <button onClick={() => updatePeriod()}>수정하기</button>
                <button onClick={closeModal}> 닫기</button>
            </div>
        </div>
    );
};

export default UpdatePeriod;
