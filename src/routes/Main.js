import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { baseUrl } from '../App';
import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';

const Main = () => {
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const setUsername = useAuthStore((state) => state.setUsername);
    const setPeriodId = useAuthStore((state) => state.setPeriodId);
    const setUserPeriodId = useAuthStore((state) => state.setUserPeriodId);

    const authData = useAuthStore();

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

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
            if (userData.periodId != null) {
                navigate(`/period/${userData.periodId}`);
            } else {
                navigate('/admin');
            }
        } catch (err) {
            alert(err.response.data.message || '로그인 실패 하셨습니다.');
        }
    };

    const navigate = useNavigate();

    return (
        <div className={styles.loginForm_wrapper}>
            <h1>로그인 하기</h1>
            <input placeholder="아이디를 입력하세요..." onChange={(e) => setLoginId(e.target.value)}></input>
            <input placeholder="비밀번호를 입력하세요..." onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => login()}>로그인 하기</button>
            <button onClick={() => navigate('/signup')}>회원가입 하기</button>
        </div>
    );
};

export default Main;
