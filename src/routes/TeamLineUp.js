import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import styles from './TeamLineUp.module.scss';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '../config';

const TeamLineUp = () => {
    const authData = useAuthStore();
    const [selectedSection, setSelectedSection] = useState('A');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTeamCreationModalOpen, setIsTeamCreationModalOpen] = useState(false);
    const [newTeamSection, setNewTeamSection] = useState('A');
    const [newTeamUserEmails, setNewTeamUserEmails] = useState([]);
    const [emailCount, setEmailCount] = useState(5);
    const [teams, setTeams] = useState([]);
    const [teamDetails, setTeamDetails] = useState({});
    let userRole = '';

    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const roles = decodedToken?.roles || [];

            // 'MANAGER'가 역할 목록에 포함되어 있으면 'MANAGER'로 설정
            if (roles.includes('MANAGER')) {
                userRole = 'MANAGER';
            } else if (roles.includes('USER')) {
                // 'USER'만 포함되어 있으면 'USER'로 설정
                userRole = 'USER';
            }
        } catch (error) {
            console.error('토큰 디코딩 오류:', error);
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/weekProgress/myweekProgress`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const weekData = response.data.data.map((week) => ({
                    id: week.id,
                    name: week.name,
                    status: getStatusLabel(week.status),
                }));
                setWeeks(weekData);
                setSelectedWeek(weekData[0]?.id || '');
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
                    const response = await axios.get(`${baseUrl}/api/weekProgress/${selectedWeek}/teams/lineup`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            section: selectedSection,
                        },
                    });
                    const teamsData = response.data.data || [];
                    setTeams(teamsData);

                    for (const team of teamsData) {
                        const teamResponse = await axios.get(
                            `${baseUrl}/api/weekProgress/${selectedWeek}/teams/${team.id}/users`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        setTeamDetails((prevDetails) => ({
                            ...prevDetails,
                            [team.id]: teamResponse.data.data,
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
        setEmailCount(5);
        setNewTeamUserEmails(Array(5).fill(''));
    };

    const handleEmailCountChange = (event) => {
        const count = parseInt(event.target.value, 10);
        setEmailCount(count);
        setNewTeamUserEmails((prevEmails) => {
            const newEmails = Array(count).fill('');
            return newEmails.slice(0, count);
        });
    };

    const handleEmailChange = (index, value) => {
        setNewTeamUserEmails((prevEmails) => {
            const updatedEmails = [...prevEmails];
            updatedEmails[index] = value;
            return updatedEmails;
        });
    };

    const handleCreateTeam = async () => {
        try {
            const userEmails = newTeamUserEmails.filter((email) => email.trim() !== '');
            const response = await axios.post(
                `${baseUrl}/api/weekProgress/${selectedWeek}/teams`,
                {
                    periodId: authData.userPeriodId,
                    section: newTeamSection,
                    userEmails,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('팀이 생성되었습니다.');
            createTeamProject(response.data.data.id);
            closeTeamCreationModal();
            window.location.reload();
        } catch (error) {
            console.error('팀 생성 오류:', error);
            alert('팀 생성 중 오류가 발생했습니다.');
        }
    };

    const createTeamProject = async (teamId) => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/weekProgress/${selectedWeek}/teams/${teamId}/page`,
                {
                    projectIntro: '',
                    notionLink: '',
                    gitLink: '',
                    figmaLink: '',
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleTeamClick = (teamId, teamName) => {
        navigate(`/team/project/${selectedWeek}/${teamId}`, { state: { teamName } }); // 수정된 라우팅 경로
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
                    <select id="week" value={selectedWeek} onChange={handleWeekChange} className={styles.weekSelect}>
                        {weeks.map((week) => (
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
                        teams.map((team) => (
                            <div
                                className={styles.card}
                                key={team.id}
                                onClick={() => handleTeamClick(team.id, team.teamName)} // 수정된 핸들러
                            >
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
                        <button className={styles.closeButton} onClick={closeTeamCreationModal}>
                            X
                        </button>
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
                            <select value={emailCount} onChange={handleEmailCountChange} className={styles.select}>
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
