import PeriodHeader from '../components/periodDetail/PeriodHeader';
import styles from './PeriodDetail.module.scss';

const PeriodDetail = () => {
    return (
        <div>
            <PeriodHeader />
            <div className={styles.periodDetail_body}>
                <div>api생기면 팀 넣을곳</div>
                <div>api생기면 채팅 넣을곳 디브박스 삭제하고</div>
            </div>
        </div>
    );
};

export default PeriodDetail;
