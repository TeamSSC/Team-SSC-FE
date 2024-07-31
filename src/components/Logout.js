import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';
import { baseUrl } from '../App';

const Logout = () => {
    const { setIsLoggedIn } = useAuthStore((state) => state);
    const { setUsername } = useAuthStore((store) => store);
    const { setPeriodId } = useAuthStore((store) => store);

    const token = localStorage.getItem('accessToken');

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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <button onClick={() => logout()}>로그아웃</button>
        </div>
    );
};

export default Logout;
