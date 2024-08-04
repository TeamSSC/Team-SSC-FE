import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';
import { baseUrl } from '../config';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { setIsLoggedIn } = useAuthStore((state) => state);
    const { setUsername } = useAuthStore((store) => store);
    const { setPeriodId } = useAuthStore((store) => store);

    const token = localStorage.getItem('accessToken');

    const navigate = useNavigate();
    const logout = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/users/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.clear();
            setUsername('');
            setIsLoggedIn(false);
            setPeriodId('');
            alert('로그아웃 되었습니다.');
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <button style={{ width: 120 }} onClick={() => logout()}>
                로그아웃
            </button>
        </div>
    );
};

export default Logout;
