import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { baseUrl } from '../config';
import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

const Main = () => {
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const setUsername = useAuthStore((state) => state.setUsername);
    const setPeriodId = useAuthStore((state) => state.setPeriodId);
    const setUserPeriodId = useAuthStore((state) => state.setUserPeriodId);

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const hasFetched = useRef(false); // useRef를 사용하여 useEffect가 실행되었는지 추적

    const login = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/users/login`, {
                email: loginId,
                password: password,
            });

            console.log(response);
            const userData = response.data.data;
            localStorage.setItem('accessToken', userData?.accessToken);
            localStorage.setItem('refreshToken', userData?.refreshToken);
            setUsername(userData?.username);
            setIsLoggedIn(true);
            setPeriodId(userData?.trackName + String(userData?.period) + '기');
            setUserPeriodId(userData?.periodId);
            if (userData.periodId != null) {
                navigate(`/period/${userData.periodId}`);
            } else {
                navigate('/admin');
            }
        } catch (err) {
            if (err.response?.data?.message === "아직 승인 받지 않은 회원입니다.") {
                alert('회원가입 승인 대기중입니다.');
            } else {
                alert('로그인에 실패하였습니다. 관리자한테 문의해주세요')
                console.error(err);
            }
            // alert(err.response.data.message || '로그인 실패 하셨습니다.');
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

                    if (userData.periodId != null, userData.userStatus != 'PENDING') {
                        navigate(`/period/${userData.periodId}`);
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
            <input placeholder="아이디를 입력하세요..." onChange={(e) => setLoginId(e.target.value)} />
            <input placeholder="비밀번호를 입력하세요..." onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => login()}>로그인 하기</button>
            <button onClick={() => navigate('/signup')}>회원가입 하기</button>
            <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
                카카오로 로그인하기
            </button>
        </div>
    );
};

export default Main;
