import styles from '../admin/CreateTrack.module.scss';

const UpdateProject = ({
    closeModal,
    updateTeam,
    setNotionLink,
    setFigmaLink,
    setGitLink,
    setProjectIntro,
    notionLink,
    figmaLink,
    gitLink,
    projectIntro,
}) => {
    return (
        <div className={styles.createTrack_wrapper}>
            <h1>팀 정보 수정</h1>
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
                <button onClick={updateTeam}>생성하기</button>
                <button onClick={closeModal}> 닫기</button>
            </div>
        </div>
    );
};

export default UpdateProject;
