export const Introduction = () => {
  return (
    <div className="flex flex-col h-full justify-between items-center">
      <div className="flex-1 w-full lg:w-[480px]">
        <div className="mb-8">
          <h2 className="text-2xl font-normal text-[16px] text-gray-100 dark:text-white mb-4">
            FORA, THE MODERN TRAVEL AGENCY
          </h2>
          <h1 className="chiswick-text-italic text-gray-100 text-[56px] lg:text-[72px] leading-relaxed">
            Discover your Toursona
          </h1>
        </div>
      </div>
      
      <div className="flex flex-col items-start w-full lg:w-[480px]">
        <div className="mb-8 space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-lg">Great travel starts with knowing yourself.</p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Your Toursona reveals the way you see the world and the best ways to explore it. Once we know your personal style, we'll connect you to an advisor who can turn your dreams into reality.</p>
        </div>
      </div>
    </div>
  );
};
