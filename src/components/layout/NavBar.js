import React, { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import Logout from '../Logout';
import styles from './NavBar.module.scss';
import { useNavigate } from 'react-router-dom';
import ManagerModal from "../manager/ManagerModal";
import {jwtDecode} from "jwt-decode";

const NavBar = () => {
    const authData = useAuthStore();
    const navigate = useNavigate();
    const [isManagerModalOpen, setManagerModalOpen] = useState(false); // 모달 상태 관리
    let userRole = '';

    // localStorage에서 액세스 토큰을 가져와서 역할 정보 추출
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken?.roles?.[0] || ''; // 토큰에서 첫 번째 역할 정보 추출
        } catch (error) {
            console.error('토큰 디코딩 오류:', error);
        }
    }

    const handleManagerPageClick = () => {
        setManagerModalOpen(true);
    };

    const closeManagerModal = () => {
        setManagerModalOpen(false);
    };

    return (
        <>
            <div className={styles.navBar_wrapper}>
                <button className={styles.navBar_button} onClick={() => navigate('/')}>
                    Team SSC
                </button>
                {authData?.isLoggedIn ? (
                    <div className={styles.nav_user}>
                        {userRole === 'MANAGER' && (
                            <button
                                className={styles.navBar_button}
                                onClick={handleManagerPageClick}
                            >
                                매니저 페이지
                            </button>
                        )}
                        <p>
                            {authData?.username}님 ({authData?.periodId})
                        </p>
                        <Logout />
                    </div>
                ) : null}
            </div>
            {isManagerModalOpen && (
                <ManagerModal onClose={closeManagerModal} />
            )}
        </>
    );
};

export default NavBar;
