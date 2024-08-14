// src/axiosInstance.js

import axios from 'axios';
import { baseUrl } from './config';
import { useNavigate } from 'react-router-dom';
import useAuthStore from "./stores/useAuthStore";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: baseUrl, // 기본 URL 설정
    headers: {
        'Content-Type': 'application/json',
    },
});

// 인터셉터 설정
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('1111')

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${baseUrl}/users/token/refresh`, null, {
                    headers: {
                        refreshToken: refreshToken,
                    },
                });
                console.log('2222')

                const newAccessToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                console.log("토큰 재발급 완료")

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                // "다시 로그인 해주세요." 메시지를 체크
                if (refreshError.response?.data?.message === '다시 로그인 해주세요.') {
                    logoutAndNavigate(); // 로그아웃 및 리다이렉트 처리
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// 로그아웃 및 리다이렉트 함수
const logoutAndNavigate = () => {
    const { setIsLoggedIn, setUsername, setPeriodId } = useAuthStore.getState(); // useAuthStore 상태 가져오기
    const navigate = useNavigate();

    // 로그아웃 처리
    localStorage.clear();
    setUsername('');
    setIsLoggedIn(false);
    setPeriodId('');
    alert('다시 로그인 해주세요.');
    navigate('/'); // 메인 페이지로 리다이렉트
};

export default axiosInstance;
