import { useState } from 'react';
import styles from './CreateTrack.module.scss';
import axios from 'axios';
import { baseUrl } from '../../App';

const CreateTrack = ({ closeModal, getTrackListHook }) => {
    const [isModalOpen, setIsModalOpen] = useState(true); // 모달 열림 상태 추가
    const [tarckName, setTrackName] = useState('');

    const token = localStorage.getItem('accessToken');
    const createTrack = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/tracks`,
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

    if (!isModalOpen) {
        return null; // 모달이 닫혔을 때는 null을 반환하여 렌더링하지 않음
    }
    return (
        <div className={styles.createTrack_wrapper}>
            <h1>트랙생성</h1>
            <input
                placeholder="생성할 트랙의 이름을 입력하세요..."
                onChange={(e) => setTrackName(e.target.value)}
            ></input>
            <div className={styles.createTrack_button_wrapper}>
                <button onClick={() => createTrack()}>생성하기</button>
                <button onClick={closeModal}> 닫기</button>
            </div>
        </div>
    );
};

export default CreateTrack;
