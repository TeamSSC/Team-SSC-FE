import { baseUrl } from '../config';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './Track.module.scss';
import Modal from '../components/modal/Modal';
import CreateTrack from '../components/admin/CreateTrack';
import UpdateTrack from '../components/admin/UpdateTrack';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../axiosInstance";

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
    const [isUpdateTrack, setIsUpdateTrack] = useState(false);
    const [trackId, setTrackId] = useState(null);

    const token = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    useEffect(() => {
        getTrackListHook();
        setIsLoading(false);
    }, []);

    const getTrackListHook = async () => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/api/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setData(response.data.data);
        } catch (err) {
            console.error('API 호출 에러:', err);
        }
    };

    const deleteTrack = async (id) => {
        const confirmed = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmed) {
            try {
                await axiosInstance.delete(`${baseUrl}/api/tracks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // 삭제 후 트랙 리스트를 갱신합니다.
                getTrackListHook();
            } catch (err) {
                console.error('트랙 삭제 에러:', err);
            }
        }
    };

    // 트랙 추가 버튼 클릭 시 호출되는 함수
    const handleAddTrackClick = () => {
        setShowAddTrackForm(true);
        setIsCreatTrack(true);
    };

    const handleUpdateTrackClick = (id) => {
        setIsUpdateTrack(true);
        setTrackId(id);
    };

    // 기수 추가 버튼 클릭 시 호출되는 함수
    const handleAddPeriodClick = () => {
        console.log('기수 추가 버튼 클릭됨');
    };

    const closeCreateModal = () => {
        setIsCreatTrack(false);
    };
    const closeUpdateModal = () => {
        setIsUpdateTrack(false);
    };

    if (isLoading) {
        return <div>로딩 중 입니다...</div>;
    }

    return (
        <div className={styles.track_form}>
            <div className={styles.track_info_wrapper}>
                <div className={styles.track_info_header}>
                    <h1>전체 트랙</h1>
                    <button onClick={handleAddTrackClick}>트랙 생성</button>
                </div>
                {data.map((track, index) => (
                    <div key={index} className={styles.track_btn_wrapper}>
                        <button className={styles.track_name} onClick={() => navigate(`/admin/${track.id}`)}>
                            {track.name}
                        </button>
                        <div className={styles.setTrack_button_wrapper}>
                            <button className={styles.edit_button} onClick={() => handleUpdateTrackClick(track.id)}>
                                수정
                            </button>
                            <button className={styles.delete_button} onClick={() => deleteTrack(track.id)}>
                                삭제
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isCreatTrack && (
                <Modal isOpen={isCreatTrack} onRequestClose={closeCreateModal} style={customModalStyles}>
                    <CreateTrack closeModal={closeCreateModal} getTrackListHook={getTrackListHook} />
                </Modal>
            )}

            {isUpdateTrack && (
                <Modal isOpen={isUpdateTrack} onRequestClose={closeUpdateModal} style={customModalStyles}>
                    <UpdateTrack closeModal={closeUpdateModal} getTrackListHook={getTrackListHook} trackId={trackId} />
                </Modal>
            )}
        </div>
    );
};

export default Track;
