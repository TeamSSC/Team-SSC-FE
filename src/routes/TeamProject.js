import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TeamProjectModal from '../components/team/TeamProjectModal';
import styles from './TeamProject.module.scss';
import useAuthStore from "../stores/useAuthStore";

const TeamProject = () => {
    const { weekProgressId, teamId } = useParams();
    const { username } = useAuthStore(state => state); // Zustand store에서 로그인된 유저의 이름 가져오기

    const [teamInfo, setTeamInfo] = useState('데이터가 없습니다.');
    const [projectIntro, setProjectIntro] = useState('데이터가 없습니다.');
    const [notionLink, setNotionLink] = useState('데이터가 없습니다.');
    const [githubLink, setGithubLink] = useState('데이터가 없습니다.');
    const [figmaLink, setFigmaLink] = useState('데이터가 없습니다.');
    const [leaderName, setLeaderName] = useState('데이터가 없습니다.');
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [pageDataExists, setPageDataExists] = useState(true); // 페이지 데이터 존재 여부 상태 추가
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            const token = localStorage.getItem('accessToken');

            try {
                // 팀 정보 및 멤버 정보 가져오기
                const [teamResponse, membersResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/weekProgress/${weekProgressId}/teams/${teamId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:8080/api/weekProgress/${weekProgressId}/teams/${teamId}/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const teamData = teamResponse.data.data || {};
                setTeamInfo(teamData.teamInfo || '데이터가 없습니다.');
                setLeaderName(teamData.leaderName || '데이터가 없습니다.');

                const membersData = membersResponse.data.data || {};
                const { userIds = [], userNames = [] } = membersData;
                setTeamMembers(userIds.map((id, index) => ({ id, name: userNames[index] || '데이터가 없습니다.' })));

                // 팀 페이지 정보 가져오기
                try {
                    const pageResponse = await axios.get(`http://localhost:8080/api/weekProgress/${weekProgressId}/teams/${teamId}/page`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const pageData = pageResponse.data.data || {};
                    if (!pageData || Object.keys(pageData).length === 0) {
                        setPageDataExists(false); // 페이지 데이터가 없을 경우
                    } else {
                        setProjectIntro(pageData.projectIntro || '데이터가 없습니다.');
                        setNotionLink(pageData.notionLink || '데이터가 없습니다.');
                        setGithubLink(pageData.gitLink || '데이터가 없습니다.');
                        setFigmaLink(pageData.figmaLink || '데이터가 없습니다.');
                    }
                } catch (pageErr) {
                    console.error('팀 페이지 조회 오류:', pageErr);
                    setPageDataExists(false); // 페이지 데이터가 없을 경우
                }
            } catch (err) {
                console.error('팀 정보 및 멤버 조회 오류:', err);
                setError('팀 정보를 불러오는 데 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [weekProgressId, teamId]);

    const handleCreatePage = async (data) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`http://localhost:8080/api/weekProgress/${weekProgressId}/teams/${teamId}/page`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('팀 페이지가 성공적으로 생성되었습니다.');
            setShowModal(false);
            window.location.reload();
        } catch (err) {
            console.error('팀 페이지 생성 오류:', err);
            alert('팀 페이지 생성 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.teamProjectContainer}>
            <header className={styles.header}>
                <h1>팀 페이지</h1>
                {!pageDataExists && (
                    <button onClick={() => setShowModal(true)} className={styles.createButton}>팀 페이지 생성</button>
                )}
            </header>
            <div className={styles.content}>
                <div className={styles.infoSection}>
                    <div className={styles.infoItem}>
                        <label>팀 정보:</label>
                        <p>{teamInfo}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>프로젝트 소개:</label>
                        <p>{projectIntro}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <label>노션 링크:</label>
                        <a href={notionLink} target="_blank" rel="noopener noreferrer">{notionLink}</a>
                    </div>
                    <div className={styles.infoItem}>
                        <label>깃 링크:</label>
                        <a href={githubLink} target="_blank" rel="noopener noreferrer">{githubLink}</a>
                    </div>
                    <div className={styles.infoItem}>
                        <label>피그마 링크:</label>
                        <a href={figmaLink} target="_blank" rel="noopener noreferrer">{figmaLink}</a>
                    </div>
                </div>
                <div className={styles.teamMembersSection}>
                    <h2>팀 멤버</h2>
                    <div className={styles.teamMembersList}>
                        {teamMembers.map(member => (
                            <div key={member.id} className={styles.memberCard}>
                                <p>{member.name}</p>
                                {member.name === leaderName && <p className={styles.leaderLabel}>팀장</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && (
                <TeamProjectModal
                    onClose={() => setShowModal(false)}
                    onSave={handleCreatePage}
                />
            )}
        </div>
    );
};

export default TeamProject;
