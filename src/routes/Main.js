import styles from "./Main.module.scss";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.mainPage_wrapper}>트랙 기수 보여주는 페이지</div>
  );
};

export default Main;
