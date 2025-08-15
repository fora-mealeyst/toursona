export const MobileComingSoon = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        {/* Icon */}
        <div className="mb-8">
          <svg 
            className="w-24 h-24 mx-auto text-gray-100" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="chiswick-text-italic text-gray-100 text-3xl mb-4">
          Mobile Design Coming Soon
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          We're working on a beautiful mobile experience for the Toursona quiz. 
          For now, please visit us on desktop to discover your travel personality.
        </p>

        {/* CTA */}
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            📱 Mobile-optimized design launching soon
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <span>✨</span>
            <span>Responsive layout</span>
            <span>✨</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <span>🎨</span>
            <span>Touch-friendly interface</span>
            <span>🎨</span>
          </div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>
    </div>
  );
};
