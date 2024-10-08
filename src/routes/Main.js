import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { baseUrl } from '../config';
import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

const Main = () => {
    const { isLoggedIn, userPeriodId, status, setIsLoggedIn, setUsername, setPeriodId, setUserPeriodId, setStatus } =
        useAuthStore((state) => ({
            isLoggedIn: state.isLoggedIn,
            userPeriodId: state.userPeriodId,
            status: state.status,
            setIsLoggedIn: state.setIsLoggedIn,
            setUsername: state.setUsername,
            setPeriodId: state.setPeriodId,
            setUserPeriodId: state.setUserPeriodId,
            setStatus: state.setStatus,
        }));

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const hasFetched = useRef(false); // useRef를 사용하여 useEffect가 실행되었는지 추적

    // 로그인 상태에 따라 리디렉션 처리
    useEffect(() => {
        if (isLoggedIn) {
            if (status == 'ACTIVE') {
                if (userPeriodId != null) {
                    navigate(`/period/${userPeriodId}`);
                } else {
                    navigate('/admin');
                }
            } else {
                navigate('/kakao/approvalStatus');
            }
        }
    }, []);

    const login = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/users/login`, {
                email: loginId,
                password: password,
            });

            const userData = response.data.data;
            localStorage.setItem('accessToken', userData?.accessToken);
            localStorage.setItem('refreshToken', userData?.refreshToken);
            setUsername(userData?.username);
            setIsLoggedIn(true);
            setPeriodId(userData?.trackName + String(userData?.period) + '기');
            setUserPeriodId(userData?.periodId);
            setStatus(userData?.userStatus);
            if (userData?.trackName === null) {
                console.log(userPeriodId);
                navigate('/admin');
            } else {
                navigate(`/period/${userData?.periodId}`);
            }
        } catch (err) {
            alert(err.response.data.message || '로그인 실패 하셨습니다.');
        }
    };

    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=7cf9695ccd3477922a5d6ddef0793d97&redirect_uri=https://team-ssc.vercel.app/`;
    };

    useEffect(() => {
        if (hasFetched.current) return; // useEffect가 이미 실행되었는지 확인
        hasFetched.current = true; // 실행되었음을 표시

        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (code) {
            const fetchKakaoLogin = async () => {
                try {
                    const response = await axios.get(`${baseUrl}/api/user/kakao/callback`, {
                        params: { code },
                    });
                    console.log(response);

                    const userData = response.data.data;
                    localStorage.setItem('accessToken', userData?.accessToken);
                    localStorage.setItem('refreshToken', userData?.refreshToken);
                    setUsername(userData?.username);
                    setIsLoggedIn(true);
                    setPeriodId(userData?.trackName + String(userData?.period) + '기');
                    setUserPeriodId(userData?.periodId);
                    setStatus(userData?.userStatus);

                    if (userPeriodId != null && userData.userStatus == 'ACTIVE') {
                        navigate(`/period/${userData?.periodId}`);
                    } else {
                        navigate('/kakao/approvalStatus');
                    }
                } catch (err) {
                    console.error(err);
                    alert('카카오 로그인 처리 중 오류가 발생했습니다.');
                }
            };

            fetchKakaoLogin();
        }
    }, []);

    return (
        <div className={styles.loginForm_wrapper}>
            <h1>로그인 하기</h1>
            <h1>!!!!! 회원가입은 웬만해선 자바스프링부트 1기로 해주세요 !!!!!</h1>
            <input placeholder="아이디를 입력하세요..." onChange={(e) => setLoginId(e.target.value)} />
            <input
                placeholder="비밀번호를 입력하세요..."
                onChange={(e) => setPassword(e.target.value)}
                type="password"
            />
            <button onClick={() => login()}>로그인 하기</button>
            <button onClick={() => navigate('/signup')}>회원가입 하기</button>
            <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
                카카오로 로그인하기
            </button>
        </div>
    );
};

export default Main;
