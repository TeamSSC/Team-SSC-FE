import axios from 'axios';
import { baseUrl } from '../config';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Period.module.scss';
import Modal from '../components/modal/Modal';
import updatePeriod from '../components/period/UpdatePeriod';
import UpdatePeriod from '../components/period/UpdatePeriod';
import CreatePeriod from '../components/period/CreatePeriod';

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

const Period = () => {
    const [periodList, setPeriodList] = useState([]);
    const [isUpdatePeriod, setIsUpdatePeriod] = useState(false);
    const [isCreatePeriod, setIsCreatePeriod] = useState(false);
    const [periodId, setPeriodId] = useState(null);

    const token = localStorage.getItem('accessToken');
    const { id } = useParams();
    useEffect(() => {
        getTrackPeriods();
    }, []);

    const getTrackPeriods = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/tracks/${id}/periods`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPeriodList(response.data.data);
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deletePeriod = async (periodId) => {
        console.log(periodId);
        try {
            const response = await axios.delete(`${baseUrl}/api/periods/${periodId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreatePeriodClick = (id) => {
        setIsCreatePeriod(true);
        setPeriodId(id);
    };

    const closeCreateModal = () => {
        setIsCreatePeriod(false);
    };

    const handleUpdatePeriodClick = (id) => {
        setIsUpdatePeriod(true);
        setPeriodId(id);
    };

    const closeUpdateModal = () => {
        setIsUpdatePeriod(false);
    };

    return (
        <div className={styles.periodList_wrapper}>
            <button onClick={() => handleCreatePeriodClick(id)}>기수생성</button>

            {periodList.map((e) => {
                return (
                    <div className={styles.period_info_wrapper}>
                        <button className={styles.info_button}>
                            {e.trackName}
                            {e.period}
                        </button>
                        <div className={styles.period_button_wrapper}>
                            <button>매니저 설정</button>
                            <button onClick={() => handleUpdatePeriodClick(e.id)}>수정</button>
                            <button className={styles.delete_button} onClick={() => deletePeriod(e.id)}>
                                삭제
                            </button>
                        </div>
                    </div>
                );
            })}
            {isCreatePeriod && (
                <Modal isOpen={isCreatePeriod} onRequestClose={closeCreateModal} style={customModalStyles}>
                    <CreatePeriod closeModal={closeCreateModal} trackId={id} getTrackPeriods={getTrackPeriods} />
                </Modal>
            )}
            {isUpdatePeriod && (
                <Modal isOpen={isUpdatePeriod} onRequestClose={closeUpdateModal} style={customModalStyles}>
                    <UpdatePeriod closeModal={closeUpdateModal} periodId={periodId} getTrackPeriods={getTrackPeriods} />
                </Modal>
            )}
        </div>
    );
};

export default Period;
