import { useState } from 'react';
import styles from '../admin/CreateTrack.module.scss';
import { baseUrl } from '../../config';
import axios from 'axios';
import axiosInstance from "../../axiosInstance";

const CreatePeriod = ({ closeModal, trackId, getTrackPeriods }) => {
    const [period, setPeriod] = useState(0);

    console.log(trackId);
    const token = localStorage.getItem('accessToken');

    const createPeriod = async () => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/api/periods`,
                {
                    trackId: trackId,
                    period: period,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            getTrackPeriods();
            closeModal();
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.createTrack_wrapper}>
            <h1>기수 생성</h1>
            <input placeholder="생성할 기수의 숫자를 입력하세요..." onChange={(e) => setPeriod(e.target.value)}></input>
            <div className={styles.createTrack_button_wrapper}>
                <button onClick={() => createPeriod()}>생성 하기</button>
                <button onClick={closeModal}> 닫기</button>
            </div>
        </div>
    );
};

export default CreatePeriod;
