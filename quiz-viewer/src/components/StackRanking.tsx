import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface RankableItem {
  id: string;
  text: string;
  rank?: number;
}

interface StackRankingProps {
  items: RankableItem[];
  onRankingChange?: (rankedItems: RankableItem[]) => void;
  title?: string;
  description?: string;
}

interface DraggableItemProps {
  item: RankableItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const ItemTypes = {
  RANKABLE_ITEM: 'rankableItem',
};

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RANKABLE_ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.RANKABLE_ITEM,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        flex items-center p-4 mb-3 bg-white border-2 border-gray-200 rounded-lg cursor-move
        transition-all duration-200 hover:border-blue-300 hover:shadow-md
        ${isDragging ? 'opacity-50 border-blue-500' : ''}
      `}
    >
      <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
        {index + 1}
      </div>
      <div className="flex-1">
        <span className="text-gray-800 font-medium">{item.text}</span>
      </div>
      <div className="text-gray-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
        </svg>
      </div>
    </div>
  );
};

export const StackRanking: React.FC<StackRankingProps> = ({
  items,
  onRankingChange,
  title = 'Rank the following items',
  description = 'Drag and drop to reorder the items from most important (top) to least important (bottom)',
}) => {
  const [rankedItems, setRankedItems] = useState<RankableItem[]>(
    items.map((item, index) => ({ ...item, rank: index + 1 }))
  );

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const newItems = [...rankedItems];
    const draggedItem = newItems[dragIndex];
    
    // Remove the dragged item
    newItems.splice(dragIndex, 1);
    
    // Insert it at the new position
    newItems.splice(hoverIndex, 0, draggedItem);
    
    // Update ranks
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    
    setRankedItems(updatedItems);
    
    if (onRankingChange) {
      onRankingChange(updatedItems);
    }
  };

  const resetRanking = () => {
    const originalOrder = items.map((item, index) => ({ ...item, rank: index + 1 }));
    setRankedItems(originalOrder);
    if (onRankingChange) {
      onRankingChange(originalOrder);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          
          <button
            onClick={resetRanking}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Reset Order
          </button>
        </div>

        <div className="space-y-2">
          {rankedItems.map((item, index) => (
            <DraggableItem
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
            />
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Current Ranking:</h4>
          <div className="text-sm text-blue-700">
            {rankedItems.map((item, index) => (
              <div key={item.id} className="flex items-center mb-1">
                <span className="font-medium w-6">{index + 1}.</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default StackRanking;
