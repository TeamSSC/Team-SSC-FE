import { useState } from 'react';
import { baseUrl } from '../../App';
import axios from 'axios';
import styles from './CreateTrack.module.scss';

const UpdateTrack = ({ closeModal, getTrackListHook, trackId }) => {
    const [isModalOpen, setIsModalOpen] = useState(true); // 모달 열림 상태 추가
    const [tarckName, setTrackName] = useState('');

    const token = localStorage.getItem('accessToken');

    const updateTrack = async () => {
        try {
            const response = await axios.put(
                `${baseUrl}/api/tracks/${trackId}`,
                {
                    name: tarckName,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data);
            getTrackListHook();
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.createTrack_wrapper}>
            <h1>트랙 수정</h1>
            <input
                placeholder="생성할 트랙의 이름을 입력하세요..."
                onChange={(e) => setTrackName(e.target.value)}
            ></input>
            <div className={styles.createTrack_button_wrapper}>
                <button onClick={() => updateTrack()}>생성하기</button>
                <button onClick={closeModal}> 닫기</button>
            </div>
        </div>
    );
};

export default UpdateTrack;
