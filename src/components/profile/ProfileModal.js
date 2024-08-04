import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import styles from './ProfileModal.module.scss';
import { baseUrl } from '../../config';

const mbtiOptions = [
    { value: 'INTJ', label: 'INTJ' },
    { value: 'INTP', label: 'INTP' },
    { value: 'INFJ', label: 'INFJ' },
    { value: 'INFP', label: 'INFP' },
    { value: 'ISTJ', label: 'ISTJ' },
    { value: 'ISFJ', label: 'ISFJ' },
    { value: 'ISTP', label: 'ISTP' },
    { value: 'ISFP', label: 'ISFP' },
    { value: 'ENTJ', label: 'ENTJ' },
    { value: 'ENTP', label: 'ENTP' },
    { value: 'ENFJ', label: 'ENFJ' },
    { value: 'ENFP', label: 'ENFP' },
    { value: 'ESTJ', label: 'ESTJ' },
    { value: 'ESFJ', label: 'ESFJ' },
    { value: 'ESTP', label: 'ESTP' },
    { value: 'ESFP', label: 'ESFP' },
];

const ProfileModal = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false); // 프로필 내용 수정 모드 상태

    // 개별 프로필 필드 상태
    const [gitLink, setGitLink] = useState('');
    const [vlogLink, setVlogLink] = useState('');
    const [intro, setIntro] = useState('');
    const [mbti, setMbti] = useState(null); // MBTI 상태를 객체로 변경

    useEffect(() => {
        // 프로필 내용을 가져와서 상태를 초기화합니다.
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                const data = response.data;
                setGitLink(data.gitLink || '');
                setVlogLink(data.vlogLink || '');
                setIntro(data.intro || '');
                setMbti(mbtiOptions.find((option) => option.value === data.mbti) || null); // MBTI 데이터 설정
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('파일을 선택해 주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.patch(`${baseUrl}/api/users/profile/image/update`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('프로필 이미지가 성공적으로 업데이트되었습니다.');
            window.location.reload(); // 페이지 새로 고침
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('프로필 이미지 업로드에 실패했습니다.');
        }
    };

    const handleEditProfile = () => {
        setShowUpload(true);
        setShowEditProfile(false); // 이미지 수정 모드로 전환
    };

    const handleEditProfileDetails = () => {
        setShowEditProfile(true);
        setShowUpload(false); // 내용 수정 모드로 전환
    };

    const handleUpdateProfile = async () => {
        // 비어있는 필드를 제외한 데이터만 포함
        const dataToUpdate = {};
        if (gitLink.trim()) dataToUpdate.gitLink = gitLink;
        if (vlogLink.trim()) dataToUpdate.vlogLink = vlogLink;
        if (intro.trim()) dataToUpdate.intro = intro;
        if (mbti) dataToUpdate.mbti = mbti.value; // MBTI는 객체에서 value를 추출

        if (Object.keys(dataToUpdate).length === 0) {
            alert('변경된 내용이 없습니다.');
            return;
        }

        try {
            await axios.patch(`${baseUrl}/api/users/profile/update`, dataToUpdate, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('프로필 내용이 성공적으로 업데이트되었습니다.');
            window.location.reload(); // 페이지 새로 고침
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('프로필 내용 업데이트에 실패했습니다.');
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>
                {!showUpload && !showEditProfile ? (
                    <div className={styles.modalButtons}>
                        <button className={styles.modalButton} onClick={handleEditProfile}>
                            프로필 이미지 수정
                        </button>
                        <button className={styles.modalButton} onClick={handleEditProfileDetails}>
                            프로필 내용 수정
                        </button>
                    </div>
                ) : showEditProfile ? (
                    <div className={styles.uploadSection}>
                        <input
                            type="text"
                            value={gitLink}
                            placeholder="GitHub 링크"
                            onChange={(e) => setGitLink(e.target.value)}
                        />
                        <input
                            type="text"
                            value={vlogLink}
                            placeholder="블로그 링크"
                            onChange={(e) => setVlogLink(e.target.value)}
                        />
                        <textarea value={intro} placeholder="자기소개" onChange={(e) => setIntro(e.target.value)} />
                        <Select options={mbtiOptions} value={mbti} onChange={setMbti} placeholder="MBTI" isSearchable />
                        <button className={styles.modalButton} onClick={handleUpdateProfile}>
                            프로필 내용 등록
                        </button>
                    </div>
                ) : (
                    <div className={styles.uploadSection}>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button className={styles.modalButton} onClick={handleUpload}>
                            프로필 이미지 등록
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
