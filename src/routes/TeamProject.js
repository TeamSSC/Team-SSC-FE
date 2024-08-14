import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import TeamProjectModal from '../components/team/TeamProjectModal';
import styles from './TeamProject.module.scss';
import useAuthStore from '../stores/useAuthStore';
import { baseUrl } from '../config';
import Modal from '../components/modal/Modal';
import UpdateProject from '../components/teamProject/UpdateProject';
import TeamCaht from '../components/chat/TeamChat';
import axiosInstance from '../axiosInstance';

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

const TeamProject = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateProject, setIsUpdateProject] = useState(false);
    const [isTeamMember, setIsTeamMember] = useState(false);
    const [figmaLink, setFigmaLink] = useState('');
    const [gitLink, setGitLink] = useState('');
    const [notionLink, setNotionLink] = useState('');
    const [projectIntro, setProjectIntro] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamInfo, setTeamInfo] = useState('');
    const [teamLeader, setTeamLeader] = useState('');

    const [memberList, setMemberList] = useState([]);
    const [memberIdList, setMemberIdList] = useState([]);

    const authData = useAuthStore();
    const token = localStorage.getItem('accessToken');

    const { weekProgressId, teamId } = useParams();

    console.log(weekProgressId, teamId);

    useEffect(() => {
        getTeam();
        getTeamMembers();
        getTeamTitle();
        setIsLoading(false);
    }, []);

    const navigate = useNavigate();

    const getTeam = async () => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/api/weekProgress/${weekProgressId}/teams/${teamId}/page`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = response.data.data;
            console.log('data', data);
            setProjectIntro(data.projectIntro);
            setFigmaLink(data.figmaLink);
            setGitLink(data.gitLink);
            setNotionLink(data.notionLink);
        } catch (err) {
            console.error(err);
        }
    };

    const getTeamMembers = async () => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/api/weekProgress/${weekProgressId}/teams/${teamId}/users`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // console.log(response.data.data);
            setMemberList(response?.data.data.userNames);
            setMemberIdList(response?.data.data.userIds);
        } catch (err) {
            console.error(err);
        }
    };

    const updateTeam = async () => {
        try {
            const response = await axiosInstance.patch(
                `${baseUrl}/api/weekProgress/${weekProgressId}/teams/${teamId}/page`,
                { projectIntro: projectIntro, figmaLink: figmaLink, gitLink: gitLink, notionLink: notionLink },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            getTeam();
            closeUpdateModal();
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateTeamTitle = async (leaderId) => {
        try {
            const response = await axiosInstance.patch(
                `${baseUrl}/api/weekProgress/${weekProgressId}/teams/${teamId}/teamInfo`,
                {
                    name: teamName,
                    leaderId: leaderId,
                    teamInfo: teamInfo,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            getTeamTitle();
        } catch (err) {
            console.error(err);
        }
    };

    const getTeamTitle = async () => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/api/weekProgress/${weekProgressId}/teams/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data.data;
            setTeamInfo(data.teamInfo);
            setTeamLeader(data.leaderName);
            setTeamName(data.teamName);
        } catch (err) {
            console.error('팀타이틀', err);
        }
    };

    const handleUpdateProjectClick = () => {
        setIsUpdateProject(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateProject(false);
    };

    memberList.map((e) => {
        if (e === authData.username) {
            setIsTeamMember(true);
        }
    });

    if (isLoading) {
        <div>로딩 중 입니다...</div>;
    }
    return (
        <div className={styles.teamProjectContainer}>
            <div className={styles.memberList_wrapper}>
                <h3>팀 멤버 구성</h3>
                {memberIdList?.length > 0 &&
                    memberIdList?.map((e, i) => {
                        return (
                            <button key={i} onClick={() => navigate(`/profile/${e}`)}>
                                {memberList[i]}
                            </button>
                        );
                    })}
            </div>
            <div className={styles.projectDetails}>
                <h1>{teamName}</h1>
                <h3>리더 : {teamLeader}</h3>
                <h3>팀 소개 : {teamInfo}</h3>
                <p>프로젝트 소개 : {projectIntro}</p>
                <p>
                    깃허브 링크 : <a href={gitLink}>{gitLink}</a>
                </p>
                <p>
                    팀 노션 링크 : <a href={notionLink}>{notionLink}</a>
                </p>
                <p>
                    피그마 링크 : <a href={figmaLink}>{figmaLink} </a>
                </p>
                <button onClick={() => handleUpdateProjectClick()}>팀 정보 수정</button>
            </div>

            {isTeamMember && (
                <div className={styles.teamChat}>
                    <TeamCaht teamId={teamId} teamName={teamName} />
                </div>
            )}

            {isUpdateProject && (
                <Modal isOpen={isUpdateProject} onRequestClose={closeUpdateModal} style={customModalStyles}>
                    <UpdateProject
                        closeModal={closeUpdateModal}
                        updateTeam={updateTeam}
                        updateTeamTitle={updateTeamTitle}
                        setNotionLink={setNotionLink}
                        setFigmaLink={setFigmaLink}
                        setGitLink={setGitLink}
                        setProjectIntro={setProjectIntro}
                        notionLink={notionLink}
                        figmaLink={figmaLink}
                        gitLink={gitLink}
                        projectIntro={projectIntro}
                        teamName={teamName}
                        setTeamName={setTeamName}
                        teamInfo={teamInfo}
                        setTeamInfo={setTeamInfo}
                        teamLeader={teamLeader}
                        setTeamLeader={setTeamLeader}
                        memberList={memberList}
                        memberIdList={memberIdList}
                        getTeam={getTeam}
                        getTeamTitle={getTeamTitle}
                    />
                </Modal>
            )}
        </div>
    );
};

export default TeamProject;
