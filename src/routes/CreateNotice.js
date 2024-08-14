import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './CreateNotice.module.scss';
import { baseUrl } from '../config';
import axiosInstance from "../axiosInstance";

const API_CREATE_NOTICE_URL = `${baseUrl}/api/notices`; // 공지사항 API URL

const CreateNotice = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    // 이미지 파일 변경 핸들러
    const handleFileChange = (event) => {
        setImages(Array.from(event.target.files));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            await axiosInstance.post(API_CREATE_NOTICE_URL, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('공지사항 생성을 성공했습니다.');
            navigate('/notice'); // 공지사항 등록 후 공지사항 목록 페이지로 이동
        } catch (err) {
            console.error('공지사항 등록 중 오류 발생:', err);
            alert('공지사항 생성 실패. 다시 시도해 주세요.'); // 알림 표시
            //navigate('/notices'); // 공지사항 등록 실패 후 공지사항 목록 페이지로 이동
        }
    };

    return (
        <div className={styles.createNoticeContainer}>
            <h1>공지사항 생성</h1>
            <form onSubmit={handleSubmit} className={styles.createNoticeForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">제목:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">내용:</label>
                    <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="images">이미지 업로드:</label>
                    <input type="file" id="images" accept="image/*" multiple onChange={handleFileChange} />
                </div>
                <div className={styles.formButtons}>
                    <button type="button" onClick={() => navigate('/notices')}>
                        이전 페이지
                    </button>
                    <button type="submit">등록하기</button>
                </div>
            </form>
        </div>
    );
};

export default CreateNotice;
