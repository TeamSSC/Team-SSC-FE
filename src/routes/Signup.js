import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './Signup.module.scss';
import { baseUrl } from '../config';
import { useNavigate } from "react-router-dom";

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
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [enteredCode, setEnteredCode] = useState('');
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [isSending, setIsSending] = useState(false); // 추가된 상태
    const navigate = useNavigate();

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

    const sendVerificationCode = async () => {
        setIsSending(true); // 버튼 비활성화
        try {
            const response = await axios.post(`${baseUrl}/api/email/send`, null, {
                params: {
                    email: email,
                },
            });
            setVerificationCode(response.data); // 서버에서 받은 인증번호 저장
            setIsCodeSent(true);
            alert('인증번호가 전송되었습니다.');
        } catch (err) {
            console.error(err);
            alert('인증번호 전송에 실패했습니다.');
        } finally {
            setIsSending(false); // 버튼 활성화
        }
    };

    const resendVerificationCode = async () => {
        if (window.confirm('인증번호를 재전송 받으시겠습니까?')) {
            sendVerificationCode();
        }
    };

    const verifyCode = () => {
        if (Number(enteredCode) === Number(verificationCode)) {
            setIsCodeValid(true);
            alert('인증번호가 확인되었습니다.');
        } else {
            setIsCodeValid(false);
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    const signup = async () => {
        if (!isCodeValid) {
            alert('이메일 인증이 필요합니다.');
            return;
        }

        if (password === confirmPw) {
            if (!isAdmin && periodId === '') {
                alert('트랙을 선택하세요.');
                return;
            }

            try {
                const response = await axios.post(`${baseUrl}/api/users/signup`, {
                    email: email,
                    password: password,
                    username: username,
                    adminKey: isAdmin ? adminKey : '', // 어드민일 때만 adminKey 전송
                    periodId: isAdmin ? null : Number(periodId), // 어드민일 때 periodId를 전송하지 않음
                });
                alert(response.data.message);
                navigate(`/`)
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {!isCodeSent ? (
                <button className={styles.button} onClick={sendVerificationCode} disabled={isSending}>
                    {isSending ? '전송 중...' : '인증번호 전송'}
                </button>
            ) : (
                <>
                    <button className={styles.button} onClick={resendVerificationCode} disabled={isSending}>
                        {isSending ? '재전송 중...' : '인증번호 재전송'}
                    </button>
                    <input
                        className={styles.input}
                        placeholder="인증번호를 입력하세요..."
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                    />
                    <button
                        className={styles.button}
                        onClick={verifyCode}
                        disabled={isCodeValid}
                    >
                        {isCodeValid ? '인증 완료' : '인증번호 확인'}
                    </button>
                </>
            )}
            <input
                className={styles.input}
                placeholder="이름을 입력하세요..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="비밀번호를 입력하세요..."
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className={styles.input}
                placeholder="비밀번호 확인..."
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
            />
            {!isAdmin && (
                <div className={styles.selectContainer}>
                    <select className={styles.select} value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
                        <option value="">트랙을 선택하세요</option>
                        {periodList.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.trackName} {e.period} 기
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {!isAdmin ? (
                <button onClick={() => setIsAdmin(true)} className={styles.admin_button}>
                    어드민 회원가입
                </button>
            ) : (
                <input
                    placeholder="어드민 키를 입력하세요..."
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                />
            )}

            <button className={styles.button} onClick={signup}>
                회원가입 하기
            </button>
        </div>
    );
};

export default Signup;
