import React from 'react';
import { ScoringResult } from '../services/scoringService';

interface QuizResultsProps {
  result: ScoringResult;
  onRetake?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ result, onRetake }) => {
  const { primaryType, secondaryType, isChameleon, breakdown, totalQuestions, answeredQuestions } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {primaryType.eyebrow}
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {primaryType.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {primaryType.description}
          </p>
        </div>

        {/* Primary Personality Type */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <div 
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: primaryType.color }}
            >
              {primaryType.name.split(' ')[1]?.[0] || primaryType.name[0]}
            </div>
          </div>

          {/* Traits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Key Traits</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {primaryType.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${primaryType.color}20`,
                    color: primaryType.color,
                    border: `1px solid ${primaryType.color}40`
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Travel Style</h3>
            <p className="text-gray-700">{primaryType.travelStyle}</p>
          </div>

          {/* Advisor Description */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Find Your Perfect Match</h3>
            <p className="text-blue-700 mb-4">{primaryType.advisorDescription}</p>
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              {primaryType.cta}
            </button>
          </div>
        </div>

        {/* Chameleon Case */}
        {isChameleon && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">You're a rare mix:</h3>
            <div className="space-y-3">
              {breakdown.slice(0, 3).map((item, index) => {
                const type = PERSONALITY_TYPES.find(t => t.id === item.type);
                if (!type) return null;
                return (
                  <div key={item.type} className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: type.color }}
                    >
                      {type.name.split(' ')[1]?.[0] || type.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{type.name}</span>
                        <span className="text-sm font-semibold text-gray-600">{item.percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-600 mt-4">
              You can shift from poolside champagne to bustling food markets to hidden neighborhood gems—all in the same trip.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <p className="text-blue-700 text-sm">
                Find an advisor who can design journeys as dynamic and versatile as you are.
              </p>
            </div>
          </div>
        )}

        {/* Secondary Type (if applicable and not Chameleon) */}
        {secondaryType && !isChameleon && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">You also have traits of:</h3>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: secondaryType.color }}
              >
                {secondaryType.name.split(' ')[1]?.[0] || secondaryType.name[0]}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{secondaryType.name}</h4>
                <p className="text-gray-600">{secondaryType.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Score Breakdown - Only show for non-Chameleons and filter out 0% scores */}
        {!isChameleon && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Your Personality Breakdown
            </h3>
            <div className="space-y-4">
              {breakdown
                .filter(item => item.percentage > 0) // Only show types with scores > 0%
                .map((item, index) => (
                  <div key={item.type} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800 capitalize">
                          {item.type.replace('-', ' ')}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: PERSONALITY_TYPES.find(t => t.id === item.type)?.color || '#6B7280'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Quiz Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{answeredQuestions}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {onRetake && (
            <button
              onClick={onRetake}
              className="px-8 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Retake Quiz
            </button>
          )}
          <div className="text-sm text-gray-500">
            Share your results with friends and family!
          </div>
        </div>
      </div>
    </div>
  );
};

// Import PERSONALITY_TYPES for the color mapping
import { PERSONALITY_TYPES } from '../services/scoringService';
