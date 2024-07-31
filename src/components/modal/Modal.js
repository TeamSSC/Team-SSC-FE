import React from 'react';
import styles from './Modal.module.scss';

const Modal = ({ onClose, children }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>
                <div className={styles.modalContent}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
