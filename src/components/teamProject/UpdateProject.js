import { useState } from 'react';
import styles from '../admin/CreateTrack.module.scss';

const UpdateProject = ({
    closeModal,
    updateTeam,
    updateTeamTitle,
    setNotionLink,
    setFigmaLink,
    setGitLink,
    setProjectIntro,
    setTeamName,
    setTeamInfo,
    setTeamLeader,
    notionLink,
    figmaLink,
    gitLink,
    projectIntro,
    teamName,
    teamInfo,
    teamLeader,
    memberList,
    memberIdList,
}) => {
    const [leaderId, setLeaderId] = useState();

    const updateSubmit = () => {
        updateTeam();
        updateTeamTitle(leaderId);
    };
    return (
        <div className={styles.createTrack_wrapper}>
            <h1>팀 정보 수정</h1>
            <input
                value={teamName}
                placeholder="수정할 팀 이름을 입력하세요..."
                onChange={(e) => setTeamName(e.target.value)}
            ></input>
            {memberIdList?.length > 0 && (
                <select onChange={(e) => setLeaderId(e.target.value)}>
                    <option value={teamLeader}>팀원을 선택하세요</option>
                    {memberIdList.map((e, i) => (
                        <option key={i} value={e}>
                            {memberList[i]}
                        </option>
                    ))}
                </select>
            )}

            <input
                value={teamInfo}
                placeholder="수정할 팀 소개를 입력하세요..."
                onChange={(e) => setTeamInfo(e.target.value)}
            ></input>
            <input
                value={projectIntro}
                placeholder="수정할 프로젝트 소개를 입력하세요..."
                onChange={(e) => setProjectIntro(e.target.value)}
            ></input>
            <input
                value={gitLink}
                placeholder="수정할 깃허브 링크를 입력하세요..."
                onChange={(e) => setGitLink(e.target.value)}
            ></input>
            <input
                value={notionLink}
                placeholder="수정할 노션 링크를 입력하세요..."
                onChange={(e) => setNotionLink(e.target.value)}
            ></input>
            <input
                value={figmaLink}
                placeholder="수정할 피그마 링크를 입력하세요..."
                onChange={(e) => setFigmaLink(e.target.value)}
            ></input>
            <div className={styles.createTrack_button_wrapper}>
                <button onClick={updateSubmit}>수정하기</button>
                <button onClick={closeModal}>닫기</button>
            </div>
        </div>
    );
};

export default UpdateProject;
