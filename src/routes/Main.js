import styles from './Main.module.scss';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    return (
        <div className={styles.loginForm_wrapper}>
            <h1>로그인 하기</h1>
            <input placeholder="아이디를 입력하세요..." onChange={(e) => setLoginId(e.target.value)}></input>
            <input placeholder="비밀번호를 입력하세요..." onChange={(e) => setPassword(e.target.value)}></input>
            <button>로그인 하기</button>
            <button onClick={() => navigate('/signup')}>회원가입 하기</button>
        </div>
    );
};

export default Main;
