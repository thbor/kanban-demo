import React from 'react';
import KanbanCard from './KanbanCard';

interface Card {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

interface KanbanColumnProps {
  title: string;
  cards: Card[];
  columnId: string;
  onAddCard?: () => void;
  onCardClick?: (cardId: string) => void;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
  draggingCardId?: string | null;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  cards,
  columnId,
  onAddCard,
  onCardClick,
  onDragStart,
  draggingCardId
}) => {
  const columnColors: Record<string, string> = {
    todo: 'bg-blue-50 border-blue-200',
    'in-progress': 'bg-yellow-50 border-yellow-200',
    review: 'bg-purple-50 border-purple-200',
    done: 'bg-green-50 border-green-200'
  };

  const columnColor = columnColors[columnId] || 'bg-gray-50 border-gray-200';

  return (
    <div className={`kanban-column rounded-lg border ${columnColor} p-4 flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
            {cards.length}
          </span>
        </div>
        {onAddCard && (
          <button
            onClick={onAddCard}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label={`Add card to ${title}`}
          >
            +
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No cards yet</p>
            {onAddCard && (
              <button
                onClick={onAddCard}
                className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
              >
                Add a card
              </button>
            )}
          </div>
        ) : (
           cards.map((card) => (
            <div
              key={card.id}
              onClick={() => onCardClick && onCardClick(card.id)}
              className="cursor-pointer"
              draggable
              onDragStart={(e) => onDragStart && onDragStart(e, card.id)}
              onDragEnd={() => {}}
            >
              <KanbanCard {...card} isDragging={card.id === draggingCardId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;