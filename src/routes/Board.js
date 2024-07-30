import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostItem from '../components/board/PostItem'; // 올바른 경로로 수정
import styles from './Board.module.scss'; // SCSS 모듈을 import

const API_URL = `http://localhost:8080/api/boards`;

const Board = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setPosts(response.data.data.content);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.boardContainer}>
            <header className={styles.header}>
                <h1>자바 5기 게시판</h1>
                <Link to="/boards/create" className={styles.createPostButton}>
                    게시글 생성
                </Link>
            </header>
            <div className={styles.boardList}>
                {posts.map(post => (
                    <PostItem key={post.boardId} post={post} />
                ))}
            </div>
            <div className={styles.pagination}>
                <button>이전</button>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>다음</button>
            </div>
        </div>
    );
};

export default Board;
