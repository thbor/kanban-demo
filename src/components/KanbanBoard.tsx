import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';

interface Card {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      {
        id: '1',
        title: 'Design Homepage',
        description: 'Create wireframes and mockups for the new homepage design',
        assignee: 'Alice',
        priority: 'high',
        tags: ['design', 'frontend']
      },
      {
        id: '2',
        title: 'Setup CI/CD Pipeline',
        description: 'Configure automated testing and deployment pipeline',
        assignee: 'Bob',
        priority: 'medium',
        tags: ['devops', 'backend']
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      {
        id: '3',
        title: 'Implement User Authentication',
        description: 'Add login and registration functionality',
        assignee: 'Charlie',
        priority: 'high',
        tags: ['security', 'backend']
      },
      {
        id: '4',
        title: 'Mobile Responsive Design',
        description: 'Ensure website works well on mobile devices',
        assignee: 'Diana',
        priority: 'medium',
        tags: ['frontend', 'responsive']
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    cards: [
      {
        id: '5',
        title: 'API Documentation',
        description: 'Write comprehensive API documentation',
        assignee: 'Eve',
        priority: 'low',
        tags: ['documentation', 'backend']
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: '6',
        title: 'Project Setup',
        description: 'Initialize project with React and TypeScript',
        assignee: 'Frank',
        priority: 'low',
        tags: ['setup', 'frontend']
      }
    ]
  }
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const handleAddCard = (columnId: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: 'New Task',
      description: 'Add description here',
      priority: 'medium'
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    );
  };

  const handleCardClick = (cardId: string) => {
    console.log(`Card clicked: ${cardId}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      let cardToMove: Card | null = null;
      
      newColumns.forEach(column => {
        const cardIndex = column.cards.findIndex(card => card.id === cardId);
        if (cardIndex > -1) {
          cardToMove = column.cards[cardIndex];
          column.cards.splice(cardIndex, 1);
        }
      });

      if (cardToMove) {
        const targetColumn = newColumns.find(col => col.id === columnId);
        if (targetColumn) {
          targetColumn.cards.push(cardToMove);
        }
      }

      return newColumns;
    });
  };

  return (
    <div className="kanban-board p-6 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Kanban Board</h1>
        <p className="text-gray-600">Drag and drop cards between columns to update their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <KanbanColumn
              title={column.title}
              cards={column.cards}
              columnId={column.id}
              onAddCard={() => handleAddCard(column.id)}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Total cards: {columns.reduce((total, column) => total + column.cards.length, 0)}</p>
      </div>
    </div>
  );
};

export default KanbanBoard;