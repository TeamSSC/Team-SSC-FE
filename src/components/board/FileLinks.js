// src/components/board/FileLinks.js
import React from 'react';
import styles from './FileLinks.module.scss';

const FileLinks = ({ fileLinks }) => {
    return (
        <div className={styles.fileLinks}>
            {fileLinks.map((fileLink, index) => (
                <div key={index} className={styles.fileLinkItem}>
                    <a href={fileLink} target="_blank" rel="noopener noreferrer">
                        <img src={fileLink} alt={`Attachment ${index + 1}`} />
                    </a>
                </div>
            ))}
        </div>
    );
};

export default FileLinks;
