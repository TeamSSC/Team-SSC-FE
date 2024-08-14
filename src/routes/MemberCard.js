import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import 합니다.
import styles from './MemberCard.module.scss'; // 스타일 시트 import
import { baseUrl } from '../config';
import axiosInstance from "../axiosInstance";

const MemberCard = () => {
    const [managers, setManagers] = useState([]); // 초기값을 빈 배열로 설정
    const [users, setUsers] = useState([]); // 초기값을 빈 배열로 설정
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState('MANAGER'); // 기본 선택된 역할 설정

    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        fetchMembers();
    }, [currentPage, selectedRole]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken'); // 액세스 토큰 가져오기

            // 데이터 가져오기
            const response = await axiosInstance.get(`${baseUrl}/api/users/profiles`, {
                params: {
                    page: currentPage, // 페이지 번호는 0부터 시작
                    role: selectedRole,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // 액세스 토큰을 헤더에 추가
                },
            });

            const { content, totalPages } = response.data.data;

            // 매니저와 일반 유저 데이터 분리
            if (selectedRole === 'MANAGER') {
                setManagers(content || []);
            } else {
                setUsers(content || []);
            }

            setTotalPages(totalPages || 1); // 총 페이지 수 설정
        } catch (error) {
            console.error('멤버 정보를 가져오는 데 실패했습니다.', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCardClick = (userId) => {
        navigate(`/profile/${userId}`); // 프로필 페이지로 이동
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>멤버 카드</h1>

            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.roleButton} ${selectedRole === 'MANAGER' ? styles.active : ''}`}
                    onClick={() => setSelectedRole('MANAGER')}
                >
                    매니저
                </button>
                <button
                    className={`${styles.roleButton} ${selectedRole === 'USER' ? styles.active : ''}`}
                    onClick={() => setSelectedRole('USER')}
                >
                    일반 유저
                </button>
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>{selectedRole === 'MANAGER' ? '매니저' : '일반 유저'}</h2>
                <div className={styles.cardContainer}>
                    {(selectedRole === 'MANAGER' ? managers : users).length > 0 ? (
                        (selectedRole === 'MANAGER' ? managers : users).map((member) => (
                            <div key={member.id} className={styles.card} onClick={() => handleCardClick(member.id)}>
                                {member.username}
                            </div>
                        ))
                    ) : (
                        <div>
                            {selectedRole === 'MANAGER' ? '매니저 정보가 없습니다.' : '일반 유저 정보가 없습니다.'}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MemberCard;
