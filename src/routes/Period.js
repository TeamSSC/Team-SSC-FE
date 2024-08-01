import axios from 'axios';
import { baseUrl } from '../App';
import { useEffect } from 'react';

const Period = () => {
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        getTrackPeriods();
    }, []);

    const getTrackPeriods = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/periods`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return <div>해당 트랙의 기수</div>;
};

export default Period;
