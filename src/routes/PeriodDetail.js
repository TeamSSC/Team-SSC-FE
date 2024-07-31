import PeriodHeader from '../components/periodDetail/PeriodHeader';
import PeriodMyTeam from '../components/periodDetail/PeriodMyTeam';
import styles from './PeriodDetail.module.scss';

const PeriodDetail = () => {
    return (
        <div>
            <PeriodHeader />
            <div className={styles.periodDetail_body}>
                <PeriodMyTeam />
                <div>api생기면 채팅 넣을곳 디브박스 삭제하고</div>
            </div>
        </div>
    );
};

export default PeriodDetail;
