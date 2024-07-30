import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseUrl } from '../App';
import styles from './Signup.module.scss';

const Signup = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [trackList, setTrackList] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [username, setUsername] = useState('');
    const [trackId, setTrackId] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        getTrack();
        setIsLoading(false);
    }, []);

    const getTrack = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/tracks`);
            console.log(response.data.data);
            setTrackList(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const signup = async () => {
        try {
            await axios.post(`${baseUrl}/api/users`, {
                email,
                password,
                username,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원가입 하기</h1>
            <input
                className={styles.input}
                placeholder="아이디를 입력하세요..."
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="이름을 입력하세요..."
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="비밀번호를 입력하세요..."
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="비밀번호 확인..."
                type="password"
                onChange={(e) => setConfirmPw(e.target.value)}
            />
            <div className={styles.selectContainer}>
                <select className={styles.select} defaultValue="">
                    <option value="" disabled>
                        하실 트랙을 선택하세요
                    </option>
                    {trackList.map((e) => (
                        <option key={e.id} value={e.name}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>

            <button className={styles.button} onClick={() => signup()}>
                회원가입 하기
            </button>
        </div>
    );
};

export default Signup;
