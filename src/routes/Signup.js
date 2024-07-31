import axios from 'axios';
import { useEffect, useState } from 'react';
import { baseUrl } from '../App';
import styles from './Signup.module.scss';

const Signup = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [periodList, setPeriodList] = useState([]);
    const [email, setEmail] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [username, setUsername] = useState('');
    const [periodId, setPeriodId] = useState('');

    useEffect(() => {
        getPeriod();
    }, []);

    const getPeriod = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/periods`);
            setPeriodList(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async () => {
        if (password === confirmPw) {
            if (periodId === '') {
                alert('트랙을 선택하세요.');
                return;
            }

            try {
                const response = await axios.post(`${baseUrl}/api/users/signup`, {
                    email: email,
                    password: password,
                    username: username,
                    adminKey: adminKey,
                    periodId: Number(periodId),
                });
                alert(response.data.message);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || '회원가입에 실패했습니다.');
            }
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    if (isLoading) {
        return <div>로딩 중 입니다....</div>;
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>회원가입 하기</h1>
            <input
                className={styles.input}
                placeholder="이메일을 입력하세요..."
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
                <select className={styles.select} defaultValue="" onChange={(e) => setPeriodId(e.target.value)}>
                    <option value="" onChange={(e) => setPeriodId('')}>
                        트랙을 선택하세요
                    </option>
                    {periodList.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.trackName} {e.period} 기
                        </option>
                    ))}
                </select>
            </div>

            {!isAdmin ? (
                <button onClick={() => setIsAdmin(true)} className={styles.admin_button}>
                    어드민 회원가입
                </button>
            ) : (
                <input placeholder="어드민 키를 입력하세요..." onChange={(e) => setAdminKey(e.target.value)}></input>
            )}

            <button className={styles.button} onClick={signup}>
                회원가입 하기
            </button>
        </div>
    );
};

export default Signup;
