import styles from "./QuizResultsFooter.module.css";

export const QuizResultsFooter = () => {
  return (
    <footer className={styles.resultsFooter}>
      <div className={styles.resultsFooterContent}>
        <h4 className={styles.resultsFooterTitle}>
          Fora, the modern travel agency
        </h4>
        <p>
          Planning travel shouldn’t feel like a second job. Our advisors are
          your creative partners, helping you live the life you dream. We know
          what you want and we’ll get you there, effortlessly.
        </p>
        <div className={styles.resultsFooterLinks}>
          <a
            href="https://www.foratravel.com/book-with-us"
            className={styles.resultsFooterLink}
          >
            Match with an advisor
          </a>
          <a
            href="https://www.foratravel.com/join"
            className={styles.resultsFooterLinkSecondary}
          >
            Become an advisor
          </a>
        </div>
      </div>
    </footer>
  );
};
