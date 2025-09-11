import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../App.module.css";
import { useQuiz } from "../hooks";
import { LoadingSpinner, ErrorMessage, QuizForm } from "./";
import { GlassElement } from "./GlassElement/GlassElement";
import { QuizFooter } from "./QuizFooter";

// Array of available images (excluding vite.svg)
const backgroundImages = [
  "images/ammar-elamir-dmyWWQVI6jA-unsplash.jpg",
  "images/anchor-lee-M3znaxt24S4-unsplash.jpg",
  "images/dario-bronnimann-tu2apPbNQTs-unsplash.jpg",
  "images/dave-ruck-LExlOWiuwR0-unsplash.jpg",
  "images/dennis-van-den-worm-VUG96jF8Gr0-unsplash.jpg",
  "images/dimitry-b-7aaf7cCLpJ4-unsplash.jpg",
  "images/dominik-puskas-ets2fmpMjvA-unsplash.jpg",
  "images/ekaterina-buyakova-olpmjP_MROw-unsplash.jpg",
  "images/elisadventure-N8RlWCGMg3o-unsplash.jpg",
  "images/frames-for-your-heart-bn57NAYNVWc-unsplash.jpg",
  "images/howen-2WsHypHQRcQ-unsplash.jpg",
  "images/ibrahim-rifath-Y6tBl0pTe-g-unsplash.jpg",
  "images/jean-valjean-2y8vVSBnHK0-unsplash.jpg",
  "images/jefferson-sees-xvbPpHJdyWw-unsplash.jpg",
  "images/joshua-sortino-71vAb1FXB6g-unsplash.jpg",
  "images/julio-rivera-WHTyxxAGLLQ-unsplash.jpg",
  "images/justine-de-gennes-ajK2wX-ZnZU-unsplash.jpg",
  "images/kate-joie-a8zRxmKSnJ4-unsplash.jpg",
  "images/lisha-riabinina--1k0g6hoGSw-unsplash.jpg",
  "images/lisha-riabinina-v6QCNVJSJiA-unsplash.jpg",
  "images/madara-parma-40ZXzGMTcLo-unsplash.jpg",
  "images/mark-boss-NtkSTKdV12w-unsplash.jpg",
  "images/markus-spiske-jT3ucn8MsGQ-unsplash.jpg",
  "images/milin-john-_3kCOGsSjVQ-unsplash.jpg",
  "images/monique-iNwBbUmc2G8-unsplash.jpg",
  "images/preeti-GzAxNgx2Sk8-unsplash.jpg",
  "images/raquel-fereshetian-Y7eyERcbyF4-unsplash.jpg",
  "images/sam-quek-KM2VdUnKrus-unsplash.jpg",
  "images/shahd-h-MXXVcKS0Rzo-unsplash.jpg",
  "images/simon-lee-FQlXwfkt-4Q-unsplash.jpg",
  "images/sk-Q6sRAxsAX68-unsplash.jpg",
  "images/stefan-stefancik-0xeskt_mU6o-unsplash.jpg",
  "images/stephan-valentin-NxiHmm4HBzw-unsplash.jpg",
  "images/steven-lewis-r4He4Btlsro-unsplash.jpg",
  "images/valeriia-miller-qDblX5nfmWY-unsplash.jpg",
  "images/victor-martin-1o6vn62g864-unsplash.jpg",
  "images/vidar-nordli-mathisen-loTTPqOed7c-unsplash.jpg",
  "images/vlad-surkov-PM46dNwm-6E-unsplash.jpg",
  "images/vladyslav-tobolenko-Lvc7orGiCag-unsplash.jpg",
  "images/vladyslav-tobolenko-wvx0zOBVMWk-unsplash.jpg",
  "images/willian-justen-de-vasconcellos-ulUnRNuC_ok-unsplash.jpg",
  "images/wolfgang-hasselmann-74Pii5EgYDk-unsplash.jpg",
  "images/zally-orsi-DF3LkQN6qgo-unsplash.jpg",
];

// Function to get a random image (ensuring it's different from current)
const getRandomImage = (currentImage?: string) => {
  let randomIndex;
  let newImage;

  do {
    randomIndex = Math.floor(Math.random() * backgroundImages.length);
    newImage = backgroundImages[randomIndex];
  } while (newImage === currentImage && backgroundImages.length > 1);

  return newImage;
};

export const QuizViewer = () => {
  const navigate = useNavigate();
  const {
    quiz,
    form,
    step,
    submitted,
    error,
    loading,
    sessionId,
    handleChange,
    handleNext,
    handlePrevious,
    isCurrentStepValid,
  } = useQuiz();

  const [currentImage, setCurrentImage] = useState<string>(getRandomImage());
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Update image only when step changes
  useEffect(() => {
    const newImage = getRandomImage(currentImage);
    setCurrentImage(newImage);
  }, [step]);

  // Check screen size for mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Navigate to results when quiz is submitted
  useEffect(() => {
    if (submitted && sessionId) {
      navigate("/results");
    }
  }, [submitted, sessionId, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!quiz) return <LoadingSpinner />;
  if (submitted)
    return <div className="text-center py-12">Calculating your results...</div>;

  const currentStep = quiz.steps[step];

  return (
    <div className={`${styles.app} min-h-screen bg-gray-95:bg-gray-900`}>
      <div className={`${styles.viewport} overflow-hidden relative`}>
        <div
          key={`step-${step}`}
          className="splash-image h-full w-full"
          style={{
            backgroundImage: currentImage ? `url(/${currentImage})` : undefined,
          }}
        ></div>
        <GlassElement
          className={`${styles.glassElement}  border border-[#FEFAF5]`}
          width={isMobile ? 180 : 400}
          height={isMobile ? 240 : 540}
          radius={184}
          depth={5}
          blur={2}
          chromaticAberration={3}
          debug={false}
        />
      </div>
      <div
        className={`${styles.quiz}  p-[24px] lg:p-[40px] flex flex-col items-center`}
      >
        <QuizForm
          quiz={quiz}
          currentStep={currentStep}
          step={step}
          form={form}
          onChange={handleChange}
          onSubmit={handleNext}
        />
      </div>
      <QuizFooter
        quiz={quiz}
        step={step}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isCurrentStepValid={isCurrentStepValid()}
      />
    </div>
  );
};
