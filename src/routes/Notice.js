import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostItem from '../components/board/PostItem';
import Pagination from '../components/pagination/Pagination';
import styles from './Notice.module.scss';
import useAuthStore from "../stores/useAuthStore";

const API_URL = 'http://localhost:8080/api/notices';

const Notice = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const authData = useAuthStore(); // useAuthStore를 사용해 authData를 가져옴

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    params: { page: currentPage },
                });
                setNotices(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 400) {
                    console.error('잘못된 페이지 번호:', error);
                    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
                } else {
                    setError(err);
                }
                setLoading(false);
            }
        };

        fetchNotices();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error && error.response && error.response.status !== 400) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.noticeContainer}>
            <header className={styles.header}>
                <h1>{authData?.periodId} 공지사항</h1>
                <Link to="/notice/create" className={styles.createPostButton}>
                    공지사항 생성
                </Link>
            </header>
            <div className={styles.noticeList}>
                {notices.length > 0 ? (
                    notices.map((notice) => (
                        <div key={notice.boardId}>
                            <Link to={`/boards/${notice.boardId}`}>
                                <PostItem post={notice} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No notices available</p>
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Notice;
