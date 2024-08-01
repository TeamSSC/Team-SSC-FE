import { baseUrl } from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './Track.module.scss';
import Modal from '../components/modal/Modal';
import CreateTrack from '../components/admin/CreateTrack';

const customModalStyles = {
    content: {
        width: '400px',
        maxWidth: '90%',
        height: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Track = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [showAddTrackForm, setShowAddTrackForm] = useState(false);
    const [isCreatTrack, setIsCreatTrack] = useState(false);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        getTrackListHook();
        setIsLoading(false);
    }, []);

    const getTrackListHook = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(response.data.data);
        } catch (err) {
            console.error('API 호출 에러:', err);
        }
    };

    // 트랙 추가 버튼 클릭 시 호출되는 함수
    const handleAddTrackClick = () => {
        setShowAddTrackForm(true);
        setIsCreatTrack(true);
    };

    // 기수 추가 버튼 클릭 시 호출되는 함수
    const handleAddPeriodClick = () => {
        console.log('기수 추가 버튼 클릭됨');
    };

    // 개별 트랙 버튼 클릭 시 호출될 함수
    const handleTrackClick = (track) => {
        console.log(`트랙 클릭됨: ${track.name}`);
        // 필요한 경우, 여기서 추가 동작을 정의할 수 있습니다.
    };

    const closeModal = () => {
        setIsCreatTrack(false);
    };

    if (isLoading) {
        return <div>로딩 중 입니다...</div>;
    }

    return (
        <div className={styles.track_form}>
            <div className={styles.track_info_wrapper}>
                <h1>전체 트랙</h1>
                <div>
                    {data.map((track, index) => (
                        <button key={index} onClick={() => handleTrackClick(track)}>
                            {track.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.track_btn_wrapper}>
                <button onClick={handleAddPeriodClick}>기수 추가</button>
                <button onClick={handleAddTrackClick}>트랙 생성</button>
            </div>
            {isCreatTrack ? (
                <Modal isOpen={isCreatTrack} onRequestClose={closeModal} style={customModalStyles}>
                    <CreateTrack closeModal={closeModal} getTrackListHook={getTrackListHook} />
                </Modal>
            ) : null}
        </div>
    );
};

export default Track;
