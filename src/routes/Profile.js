import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import Modal from '../components/profile/ProfileModal';
import { baseUrl } from '../config';

const Profile = () => {
    const [profile, setProfile] = useState({
        email: '',
        username: '',
        profileImage: null,
        section: null,
        team: null,
        period: null,
    });

    const [gitLink, setGitLink] = useState(null);
    const [vlogLink, setVlogLink] = useState(null);
    const [intro, setIntro] = useState(null);
    const [mbti, setMbti] = useState(null);

    const { userId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const authData = useAuthStore();

    const defaultProfileImage =
        'https://team-ssc.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%EB%B3%B8+%ED%94%84%EB%A1%9C%ED%95%84+%EC%82%AC%EC%A7%84.webp';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/users/${userId}/profile`);
            const data = response.data.data;
            setProfile(data);
            setGitLink(data.gitLink);
            setVlogLink(data.vlogLink);
            setIntro(data.intro);
            setMbti(data.mbti);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleEditProfile = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    const handleBackClick = () => {
        navigate(-1); // 뒤로가기
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <button className={styles.backButton} onClick={handleBackClick}>
                    &larr; 뒤로가기
                </button>
            </div>
            <div className={styles.profilePhoto}>
                <img
                    src={profile.profileImage || defaultProfileImage}
                    alt={`${profile.username || 'User'}'s profile`}
                />
            </div>
            {authData?.username === profile.username && (
                <button className={styles.editButton} onClick={handleEditProfile}>
                    프로필 수정
                </button>
            )}
            <div className={styles.profileDetails}>
                <h2>{profile.username || 'User'}</h2>
                <div className={styles.profileItem}>
                    <strong>Email:</strong>
                    <p>{profile.email || 'No email provided'}</p>
                </div>
                <div className={styles.profileItem}>
                    <strong>GitHub:</strong>
                    <a href={profile.gitLink || '#'} target="_blank" rel="noopener noreferrer">
                        {profile.gitLink || 'GitHub 링크가 없습니다.'}
                    </a>
                </div>
                <div className={styles.profileItem}>
                    <strong>Blog:</strong>
                    <a href={profile.vlogLink || '#'} target="_blank" rel="noopener noreferrer">
                        {profile.vlogLink || '블로그 링크가 없습니다.'}
                    </a>
                </div>
                <div className={styles.profileItem}>
                    <strong>Intro:</strong>
                    <p>{profile.intro || '한 줄 소개글이 없습니다'}</p>
                </div>
                <div className={styles.profileItem}>
                    <strong>MBTI:</strong>
                    <p>{profile.mbti || 'MBTI를 설정하지 않았습니다.'}</p>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    onClose={closeModal}
                    gitLink={gitLink}
                    setGitLink={setGitLink}
                    vlogLink={vlogLink}
                    setVlogLink={setVlogLink}
                    intro={intro}
                    setIntro={setIntro}
                    mbti={mbti}
                    setMbti={setMbti}
                >
                    <div className={styles.modalContent}>
                        <button
                            className={styles.modalButton}
                            onClick={() => navigate(`/profile/edit/image/${userId}`)}
                        >
                            프로필 이미지 수정
                        </button>
                        <button
                            className={styles.modalButton}
                            onClick={() => navigate(`/profile/edit/details/${userId}`)}
                        >
                            프로필 내용 수정
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Profile;
