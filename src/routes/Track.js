import { baseUrl } from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Track = () => {
    const [data, setData] = useState([]);
    const [showAddTrackForm, setShowAddTrackForm] = useState(false);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        getTrackListHook();
    }, []);

    const getTrackListHook = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setData(response.data.data);
        } catch (err) {
            console.error('API 호출 에러:', err);
        }
    };

    // 트랙 추가 버튼 클릭 시 호출되는 함수
    const handleAddTrackClick = () => {
        setShowAddTrackForm(true);
    };

    // 기수 추가 버튼 클릭 시 호출되는 함수
    const handleAddPeriodClick = () => {
        console.log('기수 추가 버튼 클릭됨');
    };

    // 개별 트랙 버튼 클릭 시 호출될 함수
    const handleTrackClick = (track) => {
        console.log(`트랙 클릭됨: ${track.name}`);
        // 필요한 경우, 여기서 추가 동작을 정의할 수 있습니다.
    };

    return (
        <div>
            <button onClick={handleAddPeriodClick}>기수 추가</button>
            <button onClick={handleAddTrackClick}>트랙 생성</button>
            <h1>전체 트랙</h1>
            <div>
                {data.map((track, index) => (
                    <button key={index} onClick={() => handleTrackClick(track)}>
                        {track.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Track;
