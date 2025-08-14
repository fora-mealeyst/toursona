import React, { useState } from 'react';
import { StackRanking } from './StackRanking';

interface RankableItem {
  id: string;
  text: string;
  rank?: number;
}

export const StackRankingDemo: React.FC = () => {
  const [rankedItems, setRankedItems] = useState<RankableItem[]>([]);

  const sampleItems: RankableItem[] = [
    { id: '1', text: 'Customer Service' },
    { id: '2', text: 'Product Quality' },
    { id: '3', text: 'Price' },
    { id: '4', text: 'Brand Reputation' },
    { id: '5', text: 'Innovation' },
  ];

  const handleRankingChange = (items: RankableItem[]) => {
    setRankedItems(items);
    console.log('New ranking:', items);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Stack Ranking Component Demo
          </h1>
          <p className="text-gray-600">
            Drag and drop the items below to rank them in order of importance
          </p>
        </div>

        <StackRanking
          items={sampleItems}
          onRankingChange={handleRankingChange}
          title="Rank these business priorities"
          description="Drag and drop to reorder from most important (top) to least important (bottom)"
        />

        {rankedItems.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Final Ranking Results
            </h3>
            <div className="space-y-2">
              {rankedItems.map((item, index) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded">
                  <span className="font-bold text-blue-600 w-8">{index + 1}</span>
                  <span className="text-gray-800">{item.text}</span>
                  <span className="ml-auto text-sm text-gray-500">
                    Rank: {item.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StackRankingDemo;
