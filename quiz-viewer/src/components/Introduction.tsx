import { Quiz } from '../types';

interface IntroductionProps {
  quiz: Quiz;
  onStart: () => void;
}

export const Introduction = ({ quiz, onStart }: IntroductionProps) => {
  return (
    <div className="flex flex-col h-full justify-between items-center">
      <div className="flex-1 w-[480px]">
        <div className="mb-8">
          <h2 className="text-2xl font-normal text-[16px] text-gray-100 mb-4">
          FORA, THE MODERN TRAVEL AGENCY
          </h2>
          <h1 className="chiswick-text-italic text-gray-100 text-[72px] leading-relaxed">
            Discover your Toursona
          </h1>
        </div>
      </div>
      
      <div className="flex flex-col items-start w-[480px]">
        <div className="mb-8 space-y-4">
          <p className="text-gray-700 text-lg">Great travel starts with knowing yourself.</p>
          <p className="text-gray-700 text-lg">Your Toursona reveals the way you see the world and the best ways to explore it. Once we know your personal style, we'll connect you to an advisor who can turn your dreams into reality.</p>
        </div>
        
        <div className="flex items-center justify-start">
          <button 
            type="button"
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 rounded-lg text-lg"
          >
            Start your journey
          </button>
        </div>
      </div>
    </div>
  );
};
