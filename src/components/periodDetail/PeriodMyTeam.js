import axios from 'axios';
import { baseUrl } from '../../App';
import { useEffect, useState } from 'react';
import PeriodMyTeamDetail from './PeriodMyTeamDetail';
import styles from './PeriodMyTeam.module.scss';

const PeriodMyTeam = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teamList, setTeamList] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        getMyTeam();
        setIsLoading(false);
    }, []);

    const getMyTeam = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/teams/myteam`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTeamList(response.data.data);
            console.log(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectChange = (event) => {
        setSelectedTeam(event.target.value);
    };

    if (isLoading) {
        return <div>로딩중 입니다...</div>;
    }

    return (
        <div className={styles.periodMyTeam_wrapper}>
            <select onChange={handleSelectChange}>
                <option value="" disabled selected>
                    팀을 선택하세요
                </option>
                {teamList?.map((e) => {
                    return (
                        <option key={e.id} value={e.id}>
                            {e.teamName}
                        </option>
                    );
                })}
            </select>
            <PeriodMyTeamDetail selectedTeam={selectedTeam} />
        </div>
    );
};

export default PeriodMyTeam;
