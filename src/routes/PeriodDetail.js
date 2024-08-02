import Chat from '../components/chat/Chat';
import PeriodHeader from '../components/periodDetail/PeriodHeader';
import PeriodMyTeam from '../components/periodDetail/PeriodMyTeam';
import styles from './PeriodDetail.module.scss';

const PeriodDetail = () => {
    return (
        <div>
            <PeriodHeader />
            <div className={styles.periodDetail_body}>
                <PeriodMyTeam />
                <Chat />
            </div>
        </div>
    );
};

export default PeriodDetail;
