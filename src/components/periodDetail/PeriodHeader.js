import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PeriodHeader.module.scss';

const PeriodHeader = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.periodHeader_wrapper}>
            <button onClick={() => navigate('/team/lineup')}>팀 편성표</button>
            <button onClick={() => navigate('/members/card')}>멤버카드</button>
            <button onClick={() => navigate('/boards')}>커뮤니티</button>
            <button onClick={() => navigate('/notice')}>공지사항</button>
        </div>
    );
};

export default PeriodHeader;
