import axios from 'axios';
import useAuthStore from '../stores/useAuthStore';
import { baseUrl } from '../App';

const Logout = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuthStore((state) => state);

    const accessToken = localStorage.getItem('accessToken');

    const logout = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/users/logout`, {}, { headers: `Bearer ${accessToken}` });
            localStorage.clear();
            setIsLoggedIn(false);
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
