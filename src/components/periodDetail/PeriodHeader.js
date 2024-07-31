import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PeriodHeader.module.scss';

const PeriodHeader = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.periodHeader_wrapper}>
            <button>
                <a href="https://teamsparta.notion.site/8b0500cba8ac47cd8ef8b85f82afdae0">발제 모음</a>
            </button>
            <button>팀 편성표</button>
            <button>
                <a href="https://zep.us/play/y0B0nA">잽</a>
            </button>
            <button>멤버카드</button>
            <button>
                <a href="https://nbcamp.spartacodingclub.kr/mypage/attendance">출석 체크</a>
            </button>
            <button>
                <a href="https://docs.google.com/spreadsheets/d/1ExbdHRdjBo53dDq7i64FbEkCDMdWqcFe/edit?gid=1843912623#gid=1843912623">
                    시간표
                </a>
            </button>
            <button
                onClick={() => navigate('/boards')}
            >
                커뮤니티
            </button>
            <button
                onClick={() => navigate('/notice')}
            >공지사항</button>
        </div>
    );
};

export default PeriodHeader;
