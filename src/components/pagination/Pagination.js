// src/components/pagination/Pagination.js
import React from 'react';
import styles from './Pagination.module.scss'; // SCSS 모듈을 import

const Pagination = ({ currentPage, onPageChange }) => {
    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
            >
                이전
            </button>
            <span className={styles.currentPage}>
                {currentPage}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                className={styles.pageButton}
            >
                다음
            </button>
        </div>
    );
};

export default Pagination;
