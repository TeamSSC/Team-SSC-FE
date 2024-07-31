import useAuthStore from '../../stores/useAuthStore';
import Logout from '../Logout';
import styles from './NavBar.module.scss';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const authData = useAuthStore();
    const navigate = useNavigate();
    return (
        <>
            <div className={styles.navBar_wrapper}>
                <button className={styles.navBar_button} onClick={() => navigate('/')}>
                    Team SSC
                </button>
                {authData?.isLoggedIn ? (
                    <div className={styles.nav_user}>
                        <p>
                            {' '}
                            {authData?.username}님 ({authData?.periodId})
                        </p>{' '}
                        <Logout />
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default NavBar;
