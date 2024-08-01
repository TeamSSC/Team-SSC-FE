import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from "../stores/useAuthStore";
import styles from './TeamLineUp.module.scss';
import { jwtDecode } from 'jwt-decode';

const TeamLineUp = () => {
    const authData = useAuthStore();
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTeamCreationModalOpen, setIsTeamCreationModalOpen] = useState(false);
    const [newTeamSection, setNewTeamSection] = useState('A');
    const [newTeamUserEmails, setNewTeamUserEmails] = useState([]);
    const [emailCount, setEmailCount] = useState(5); // 기본값 5명
    const [teams, setTeams] = useState([]); // 팀 데이터 상태 추가
    const [teamDetails, setTeamDetails] = useState({}); // 팀 상세 정보 상태 추가
    let userRole = '';

    // LocalStorage에서 액세스 토큰을 가져와서 역할 정보 추출
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken?.roles?.[0] || ''; // 토큰에서 첫 번째 역할 정보 추출
        } catch (error) {
            console.error('토큰 디코딩 오류:', error);
        }
    }

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/weekProgress/myweekProgress', {
                    headers: {
                        Authorization: `Bearer ${token}`
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
    }, [token]);

    useEffect(() => {
        if (selectedWeek && selectedSection) {
            const fetchTeams = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/weekProgress/${selectedWeek}/teams/lineup`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            section: selectedSection
                        }
                    });
                    const teamsData = response.data.data || [];
                    setTeams(teamsData);

                    // 팀 상세 데이터 가져오기
                    for (const team of teamsData) {
                        const teamResponse = await axios.get(`http://localhost:8080/api/weekProgress/${selectedWeek}/teams/${team.id}/users`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setTeamDetails(prevDetails => ({
                            ...prevDetails,
                            [team.id]: teamResponse.data.data
                        }));
                    }
                } catch (error) {
                    console.error('팀 편성표 조회 실패:', error);
                }
            };

            fetchTeams();
        }
    }, [selectedWeek, selectedSection, token]);

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

    const openTeamCreationModal = () => {
        setIsTeamCreationModalOpen(true);
    };

    const closeTeamCreationModal = () => {
        setIsTeamCreationModalOpen(false);
        setNewTeamSection('A');
        setEmailCount(5); // 모달 닫을 때 기본값으로 리셋
        setNewTeamUserEmails(Array(5).fill('')); // 초기 5개의 빈 이메일 필드
    };

    const handleEmailCountChange = (event) => {
        const count = parseInt(event.target.value, 10);
        setEmailCount(count);
        setNewTeamUserEmails(prevEmails => {
            const newEmails = Array(count).fill('');
            return newEmails.slice(0, count); // 선택된 개수만큼만 유지
        });
    };

    const handleEmailChange = (index, value) => {
        setNewTeamUserEmails(prevEmails => {
            const updatedEmails = [...prevEmails];
            updatedEmails[index] = value;
            return updatedEmails;
        });
    };

    const handleCreateTeam = async () => {
        try {
            const userEmails = newTeamUserEmails.filter(email => email.trim() !== '');
            const response = await axios.post(`http://localhost:8080/api/weekProgress/${selectedWeek}/teams`, {
                periodId: authData.userPeriodId, // userPeriodId 사용
                section: newTeamSection,
                userEmails
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('팀이 생성되었습니다.');
            closeTeamCreationModal(); // 모달 닫기
            window.location.reload();
        } catch (error) {
            console.error('팀 생성 오류:', error);
            alert('팀 생성 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.teamLineUpContainer}>
            <header className={styles.header}>
                <h1>{authData?.periodId} 팀편성표</h1>
            </header>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label htmlFor="section">반 선택:</label>
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
                <div className={styles.cardContainer}>
                    {teams.length > 0 ? (
                        teams.map(team => (
                            <div className={styles.card} key={team.id}>
                                <div className={styles.cardTitle}>{team.teamName}</div>
                                <div className={styles.cardContent}>
                                    {teamDetails[team.id]?.userNames?.length > 0 ? (
                                        teamDetails[team.id].userNames.map((name, index) => (
                                            <div key={index} className={styles.cardUserName}>
                                                {name}
                                            </div>
                                        ))
                                    ) : (
                                        <p>팀원 정보가 없습니다.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>팀 데이터가 없습니다.</p>
                    )}
                </div>
            </div>
            {userRole === 'MANAGER' && (
                <button className={styles.createTeamButton} onClick={openTeamCreationModal}>
                    팀 생성
                </button>
            )}
            {isTeamCreationModalOpen && (
                <div className={styles.modalOverlay} onClick={closeTeamCreationModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeTeamCreationModal}>X</button>
                        <h2>팀 생성</h2>
                        <label>
                            섹션:
                            <select
                                value={newTeamSection}
                                onChange={(e) => setNewTeamSection(e.target.value)}
                                className={styles.select}
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                            </select>
                        </label>
                        <label>
                            팀원 수:
                            <select
                                value={emailCount}
                                onChange={handleEmailCountChange}
                                className={styles.select}
                            >
                                <option value="1">1명</option>
                                <option value="2">2명</option>
                                <option value="3">3명</option>
                                <option value="4">4명</option>
                                <option value="5">5명</option>
                            </select>
                        </label>
                        {newTeamUserEmails.map((email, index) => (
                            <input
                                key={index}
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                placeholder={`팀원 ${index + 1} 이메일`}
                                className={styles.input}
                            />
                        ))}
                        <button className={styles.createButton} onClick={handleCreateTeam}>
                            팀 생성
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamLineUp;
