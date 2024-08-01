import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TeamLineUp.module.scss';
import useAuthStore from "../stores/useAuthStore";

const TeamLineUp = () => {
    const authData = useAuthStore();
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/weekProgress/myweekProgress', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const weekData = response.data.data.map(week => ({
                    id: week.id,
                    name: week.name,
                    status: getStatusLabel(week.status)
                }));
                setWeeks(weekData);
                setSelectedWeek(weekData[0]?.id || ''); // 기본적으로 첫 번째 주차를 선택
                setLoading(false);
            } catch (error) {
                console.error('주차 정보 조회 실패:', error);
                setLoading(false);
            }
        };

        fetchWeeks();
    }, []);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PLANNED':
                return '진행 예정';
            case 'ONGOING':
                return '현재 주차';
            case 'COMPLETED':
                return '지난 주차';
            default:
                return '알 수 없음';
        }
    };

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value);
    };

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.teamLineUpContainer}>
            <header className={styles.header}>
                <h1>{authData?.periodId} 팀편성표</h1>
            </header>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label htmlFor="section">섹션 선택:</label>
                    <select
                        id="section"
                        value={selectedSection}
                        onChange={handleSectionChange}
                        className={styles.sectionSelect}
                    >
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="week">주차 선택:</label>
                    <select
                        id="week"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className={styles.weekSelect}
                    >
                        {weeks.map(week => (
                            <option key={week.id} value={week.id}>
                                {week.name} ({week.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={styles.teamLineUpContent}>
                {/* 팀 편성표 내용은 여기에서 렌더링됩니다 */}
            </div>
        </div>
    );
};

export default TeamLineUp;
