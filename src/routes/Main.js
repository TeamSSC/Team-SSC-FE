import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../stores/useAuthStore';
import axios from 'axios';
import { baseUrl } from '../App';

const Main = () => {
    const { isLoggedIn, username, setIsLoggedIn, setUsernmae } = useAuthStore((state) => state);

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/users/login`, {
                email: loginId,
                password: password,
            });
            console.log(response.data.data);
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
            setIsLoggedIn(true);
            setUsernmae(response.data.data.username);
        } catch (err) {
            console.error(err);
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
