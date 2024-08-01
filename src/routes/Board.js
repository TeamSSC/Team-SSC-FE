// Board.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostItem from '../components/board/PostItem';
import Pagination from '../components/pagination/Pagination';
import styles from './Board.module.scss';
import useAuthStore from "../stores/useAuthStore";

const API_URL = 'http://localhost:8080/api/boards';

const Board = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const authData = useAuthStore(); // authData를 가져옵니다.

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    params: { page: currentPage },
                });
                setPosts(response.data.data.content);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 400) {
                    alert('해당 페이지에 게시글이 없습니다');
                    setCurrentPage(currentPage - 1);
                    setError(null); // UI에 오류를 표시하지 않도록 오류 상태를 초기화
                } else {
                    setError(err);
                }
            }
        };

        fetchPosts();
        setLoading(false);
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error && error.response && error.response.status !== 400) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.boardContainer}>
            <header className={styles.header}>
                <h1>{authData?.periodId} 게시판</h1>
                <Link to="/boards/create" className={styles.createPostButton}>
                    게시글 생성
                </Link>
            </header>
            <div className={styles.boardList}>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.boardId}>
                            <Link to={`/boards/${post.boardId}`}>
                                <PostItem post={post} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
            <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
    );
};

export default Board;
