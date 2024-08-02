import React, { useState } from 'react';
import styles from './TeamProjectModal.module.scss'; // 적절한 스타일 모듈 경로로 수정

const TeamProjectModal = ({ onClose, onSave }) => {
    const [projectIntro, setProjectIntro] = useState('');
    const [notionLink, setNotionLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [figmaLink, setFigmaLink] = useState('');

    const handleSave = () => {
        const data = {
            projectIntro,
            notionLink,
            gitLink: githubLink,
            figmaLink
        };
        onSave(data);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h2>팀 페이지 생성</h2>
                <label>
                    프로젝트 소개:
                    <textarea
                        value={projectIntro}
                        onChange={(e) => setProjectIntro(e.target.value)}
                        placeholder="프로젝트 소개를 입력하세요..."
                        className={styles.textarea}
                    />
                </label>
                <label>
                    노션 링크:
                    <input
                        type="url"
                        value={notionLink}
                        onChange={(e) => setNotionLink(e.target.value)}
                        placeholder="https://your-notion-link.com"
                        className={styles.input}
                    />
                </label>
                <label>
                    깃 링크:
                    <input
                        type="url"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        placeholder="https://github.com/your-repo"
                        className={styles.input}
                    />
                </label>
                <label>
                    피그마 링크:
                    <input
                        type="url"
                        value={figmaLink}
                        onChange={(e) => setFigmaLink(e.target.value)}
                        placeholder="https://www.figma.com/file/your-file"
                        className={styles.input}
                    />
                </label>
                <button className={styles.saveButton} onClick={handleSave}>저장</button>
            </div>
        </div>
    );
};

export default TeamProjectModal;
