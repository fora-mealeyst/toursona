import { useState, useEffect } from 'react';
import { useQuiz } from './hooks';
import { 
  LoadingSpinner, 
  ErrorMessage, 
  QuizResults, 
  QuizForm 
} from './components';
import { GlassElement } from './components/GlassElement/GlassElement';

// Array of available images (excluding vite.svg)
const backgroundImages = [
  'images/ammar-elamir-dmyWWQVI6jA-unsplash.jpg',
  'images/anchor-lee-M3znaxt24S4-unsplash.jpg',
  'images/dario-bronnimann-tu2apPbNQTs-unsplash.jpg',
  'images/dave-ruck-LExlOWiuwR0-unsplash.jpg',
  'images/dennis-van-den-worm-VUG96jF8Gr0-unsplash.jpg',
  'images/dimitry-b-7aaf7cCLpJ4-unsplash.jpg',
  'images/dominik-puskas-ets2fmpMjvA-unsplash.jpg',
  'images/ekaterina-buyakova-olpmjP_MROw-unsplash.jpg',
  'images/elisadventure-N8RlWCGMg3o-unsplash.jpg',
  'images/frames-for-your-heart-bn57NAYNVWc-unsplash.jpg',
  'images/howen-2WsHypHQRcQ-unsplash.jpg',
  'images/ibrahim-rifath-Y6tBl0pTe-g-unsplash.jpg',
  'images/jean-valjean-2y8vVSBnHK0-unsplash.jpg',
  'images/jefferson-sees-xvbPpHJdyWw-unsplash.jpg',
  'images/joshua-sortino-71vAb1FXB6g-unsplash.jpg',
  'images/julio-rivera-WHTyxxAGLLQ-unsplash.jpg',
  'images/justine-de-gennes-ajK2wX-ZnZU-unsplash.jpg',
  'images/kate-joie-a8zRxmKSnJ4-unsplash.jpg',
  'images/lisha-riabinina--1k0g6hoGSw-unsplash.jpg',
  'images/lisha-riabinina-v6QCNVJSJiA-unsplash.jpg',
  'images/madara-parma-40ZXzGMTcLo-unsplash.jpg',
  'images/mark-boss-NtkSTKdV12w-unsplash.jpg',
  'images/markus-spiske-jT3ucn8MsGQ-unsplash.jpg',
  'images/milin-john-_3kCOGsSjVQ-unsplash.jpg',
  'images/monique-iNwBbUmc2G8-unsplash.jpg',
  'images/preeti-GzAxNgx2Sk8-unsplash.jpg',
  'images/raquel-fereshetian-Y7eyERcbyF4-unsplash.jpg',
  'images/sam-quek-KM2VdUnKrus-unsplash.jpg',
  'images/shahd-h-MXXVcKS0Rzo-unsplash.jpg',
  'images/simon-lee-FQlXwfkt-4Q-unsplash.jpg',
  'images/sk-Q6sRAxsAX68-unsplash.jpg',
  'images/stefan-stefancik-0xeskt_mU6o-unsplash.jpg',
  'images/stephan-valentin-NxiHmm4HBzw-unsplash.jpg',
  'images/steven-lewis-r4He4Btlsro-unsplash.jpg',
  'images/valeriia-miller-qDblX5nfmWY-unsplash.jpg',
  'images/victor-martin-1o6vn62g864-unsplash.jpg',
  'images/vidar-nordli-mathisen-loTTPqOed7c-unsplash.jpg',
  'images/vlad-surkov-PM46dNwm-6E-unsplash.jpg',
  'images/vladyslav-tobolenko-Lvc7orGiCag-unsplash.jpg',
  'images/vladyslav-tobolenko-wvx0zOBVMWk-unsplash.jpg',
  'images/willian-justen-de-vasconcellos-ulUnRNuC_ok-unsplash.jpg',
  'images/wolfgang-hasselmann-74Pii5EgYDk-unsplash.jpg',
  'images/zally-orsi-DF3LkQN6qgo-unsplash.jpg'
];

// Function to get a random image
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};

const App = () => {
  const {
    quiz,
    form,
    step,
    submitted,
    error,
    loading,
    scoringResult,
    handleChange,
    handleNext,
    handlePrevious,
    handleRetake,
  } = useQuiz();

  const [currentImage, setCurrentImage] = useState<string>('');

  // Update image only when step changes
  useEffect(() => {
    setCurrentImage(getRandomImage());
  }, [step]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!quiz) return <LoadingSpinner />;
  if (submitted && scoringResult) return <QuizResults result={scoringResult} onRetake={handleRetake} />;
  if (submitted) return <div className="text-center py-12">Calculating your results...</div>;

  const currentStep = quiz.steps[step];

  return (
    <div className="grid grid-flow-col grid-cols-12 min-h-screen bg-gray-95:bg-gray-900">
      <div 
        className="col-span-6 h-full overflow-hidden relative"
      >
        <div className="splash-image h-full" style={{
          backgroundImage: currentImage ? `url(/${currentImage})` : undefined
        }}></div>
        <GlassElement
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          width={380}
          height={512}
          radius={184}
          depth={5}
          blur={2}
          chromaticAberration={3}
          debug={false}
        />
      </div>
      <div className="col-span-6 p-[40px] h-[calc(100%-80px)] flex flex-col items-center">
        <h1 className="text-[16px] font-normal uppercase text-gray-100 dark:text-white mb-[24px] mt-0 text-center h-[40px] w-[480px] text-left">
          {quiz.title}
        </h1>
        <QuizForm
          quiz={quiz}
          currentStep={currentStep}
          step={step}
          form={form}
          onChange={handleChange}
          onSubmit={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  );
}

export default App;
