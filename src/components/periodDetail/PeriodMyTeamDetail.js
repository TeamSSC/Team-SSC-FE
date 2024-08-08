import axios from 'axios';
import { baseUrl } from '../../config';
import { useState, useEffect } from 'react';
import styles from './PeriodMyTeamDetail.module.scss';
import { useNavigate } from 'react-router-dom';

const PeriodMyTeamDetail = ({ selectedTeam }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [memberList, setMemberList] = useState([]);
    const [memberIdList, setMemberIdList] = useState([]);

    const token = localStorage.getItem('accessToken');

    // console.log(selectedTeam, 'fdsfdasfdasfdasfdas');

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedTeam != null) {
            getMyTeamMember();
        }
        setIsLoading(false);
    }, [selectedTeam]);

    const getMyTeamMember = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/teams/myteam/${selectedTeam}/members`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMemberIdList(response.data.data.userIds);
            setMemberList(response.data.data.userNames);
            console.log(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.teamDetail_wrapper}>
            {memberList.map((e, i) => {
                return <button onClick={() => navigate(`/profile/${memberIdList[i]}`)}>{e}</button>;
            })}
        </div>
    );
};

export default PeriodMyTeamDetail;
