import { useState, useEffect } from 'react';
import styles from './QuizResults.module.css';
import { ScoringResult, calculateScores } from '../services/scoringService';
import { GlassElement } from './GlassElement/GlassElement';
import { API_BASE_URL } from '../constants';

interface QuizResultsProps {
  result?: ScoringResult;
  onRetake?: () => void;
  sessionId?: string;
  quiz?: any;
}

export const QuizResults = ({result, sessionId, quiz}: QuizResultsProps) => {
  const [calculatedResult, setCalculatedResult] = useState<ScoringResult | null>(result || null);
  const [loading, setLoading] = useState(!result);

  // Fetch and calculate results if we have a session ID but no result
  useEffect(() => {
    const fetchAndCalculateResults = async () => {
      if (!sessionId || !quiz || result) return;
      
      try {
        const quizId = new URLSearchParams(window.location.search).get('quiz_id');
        if (!quizId) return;
        
        const answersRes = await fetch(`${API_BASE_URL}${quizId}/answers/${sessionId}`);
        if (answersRes.ok) {
          const answerData = await answersRes.json();
          const allAnswers = answerData.answers || {};
          
          const calculatedResult = calculateScores(quiz, allAnswers);
          setCalculatedResult(calculatedResult);
        }
      } catch (err) {
        console.error('Failed to fetch and calculate results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateResults();
  }, [sessionId, quiz, result]);

  if (loading) {
    return <div className="text-center py-12">Loading your results...</div>;
  }

  if (!calculatedResult) {
    return <div className="text-center py-12">No results available</div>;
  }

  const { primaryType, breakdown } = calculatedResult;
  console.log('QuizResults received:', { primaryType, breakdown, sessionId });
  return (
    <div className={styles.quizResults}>
      <h2 className={styles.tagline}>Meet your toursona</h2>
      <h1 className={styles.toursonaName}>The {primaryType.name}</h1>
      <p className={styles.toursonaDescription}>You're {breakdown.find(item => item.type === primaryType.id)?.percentage}% {primaryType.name} who loves {primaryType.travelStyle}</p>
      <p className={styles.advisorDescription}>{primaryType.advisorDescription}</p>
      <a className={styles.matchAdvisorButton} href="https://www.foratravel.com/book-with-us" target="_blank" rel="noopener noreferrer">Match an advisor</a>
      <div className={styles.windowsContainer}>
        <div className={styles.window}></div>
        <div className={styles.windowCenter}>
          <div className={styles.videoContainer}>
            <video 
              className={styles.video}
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src="/videos/Fora_Home_Hero_V2_Horizontal_Compressed.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <GlassElement
            className={styles.videoOverlay}
            width={336}
            height={448}
            radius={184}
            depth={5}
            blur={0}
            chromaticAberration={3}
            debug={false}
          />
          <svg className={styles.arrow} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M26.7073 12.7075L16.7073 22.7075C16.6144 22.8005 16.5041 22.8742 16.3828 22.9246C16.2614 22.9749 16.1312 23.0008 15.9998 23.0008C15.8684 23.0008 15.7383 22.9749 15.6169 22.9246C15.4955 22.8742 15.3852 22.8005 15.2923 22.7075L5.29231 12.7075C5.1523 12.5676 5.05693 12.3894 5.01828 12.1953C4.97963 12.0012 4.99944 11.8 5.07519 11.6172C5.15094 11.4344 5.27923 11.2782 5.44383 11.1683C5.60842 11.0584 5.80192 10.9998 5.99981 11H25.9998C26.1977 10.9998 26.3912 11.0584 26.5558 11.1683C26.7204 11.2782 26.8487 11.4344 26.9244 11.6172C27.0002 11.8 27.02 12.0012 26.9813 12.1953C26.9427 12.3894 26.8473 12.5676 26.7073 12.7075Z" fill="#F3EBE2"/>
          </svg>
        </div>
        <div className={styles.window}></div>
      </div>
      <p className={styles.shareResultsDescription}>Share your results</p>
      <div className={styles.socialLinks}>
        <a className={styles.shareInstagram} href={`https://www.instagram.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"></a>
        <a className={styles.shareX} href={`https://www.x.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"></a>
        <a className={styles.shareTikTok} href={`https://www.tiktok.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"></a>
      </div>
    </div>
  );
};