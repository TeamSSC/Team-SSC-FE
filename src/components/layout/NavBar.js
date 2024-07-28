import styles from "./NavBar.module.scss";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.navBar_wrapper}>
        <button className={styles.navBar_button} onClick={() => navigate("/")}>
          Team SSC
        </button>
      </div>
    </>
  );
};

export default NavBar;
