import React, { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import Logout from '../Logout';
import styles from './NavBar.module.scss';
import { useNavigate } from 'react-router-dom';
import ManagerModal from '../manager/ManagerModal';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
    const authData = useAuthStore();
    const navigate = useNavigate();
    const [isManagerModalOpen, setManagerModalOpen] = useState(false); // 모달 상태 관리
    let userRole = '';
    console.log(authData);
    // localStorage에서 액세스 토큰을 가져와서 역할 정보 추출
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const roles = decodedToken?.roles || [];

            // 'MANAGER'가 역할 목록에 포함되어 있으면 'MANAGER'로 설정
            if (roles.includes('ADMIN')) {
                userRole = 'ADMIN';
            } else if (roles.includes('MANAGER')) {
                userRole = 'MANAGER';
            } else if (roles.includes('USER')) {
                // 'USER'만 포함되어 있으면 'USER'로 설정
                userRole = 'USER';
            } else if (roles.includes('ADMIN')) {
                userRole = 'ADMIN';
            }
        } catch (error) {
            console.error('토큰 디코딩 오류:', error);
        }
    }

    const handleButtonClick = () => {
        if (authData?.isLoggedIn) {
            if (authData.status == 'ACTIVE') {
                if (userRole === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate(`/period/${authData.userPeriodId}`);
                }
            } else {
                navigate('/kakao/approvalStatus');
            }
        } else {
            navigate('/');
        }
    };

    const handleManagerPageClick = () => {
        setManagerModalOpen(true);
    };

    const closeManagerModal = () => {
        setManagerModalOpen(false);
    };

    return (
        <>
            <div className={styles.navBar_wrapper}>
                <button className={styles.navBar_button} onClick={handleButtonClick}>
                    Team SSC
                </button>
                {authData?.isLoggedIn ? (
                    <div className={styles.nav_user}>
                        {userRole === 'MANAGER' && (
                            <button className={styles.navBar_button} onClick={handleManagerPageClick}>
                                매니저 페이지
                            </button>
                        )}
                        <p>
                            {authData?.username}님 ({userRole === 'ADMIN' ? '어드민' : authData?.periodId})
                        </p>
                        <Logout />
                    </div>
                ) : null}
            </div>
            {isManagerModalOpen && <ManagerModal onClose={closeManagerModal} />}
        </>
    );
};

export default NavBar;
