import { useState } from 'react';
import styles from './CollapsiblePanel.module.css';

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsiblePanel = ({ title, children, defaultExpanded = false }: CollapsiblePanelProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={styles.panel}>
      <button
        className={`${styles.panelHeader} ${isExpanded ? styles.expanded : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className={styles.panelTitle}>{title}</span>
        <svg
          className={`${styles.chevron} ${isExpanded ? styles.rotated : ''}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`${styles.panelContent} ${isExpanded ? styles.expanded : ''}`}>
        {children}
      </div>
    </div>
  );
};
