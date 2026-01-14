import React, { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'kanban-board-state';
const TIMESTAMP_KEY = 'kanban-board-last-saved';

const loadStateFromStorage = (): Column[] | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load state from storage:', error);
  }
  return null;
};

const saveStateToStorage = (state: Column[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save state to storage:', error);
  }
};

const getLastSavedTime = (): string | null => {
  try {
    return localStorage.getItem(TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to get last saved time:', error);
    return null;
  }
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedState = loadStateFromStorage();
    return savedState || initialColumns;
  });
  const [draggingOverColumn, setDraggingOverColumn] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => getLastSavedTime());

  const updateColumns = (newColumns: Column[] | ((prev: Column[]) => Column[])) => {
    setColumns(prev => {
      const updated = typeof newColumns === 'function' ? newColumns(prev) : newColumns;
      saveStateToStorage(updated);
      setLastSavedTime(new Date().toISOString());
      return updated;
    });
  };

  const handleManualSave = () => {
    saveStateToStorage(columns);
    setLastSavedTime(new Date().toISOString());
    alert('Board state saved successfully!');
  };

  const handleManualLoad = () => {
    const savedState = loadStateFromStorage();
    if (savedState) {
      updateColumns(savedState);
      setLastSavedTime(getLastSavedTime());
      alert('Board state loaded successfully!');
    } else {
      alert('No saved state found.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the board to initial state? This will clear all current cards.')) {
      updateColumns(initialColumns);
      alert('Board reset to initial state.');
    }
  };

  const handleClearStorage = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TIMESTAMP_KEY);
      setLastSavedTime(null);
      alert('All saved data cleared.');
    }
  };

  const handleAddCard = (columnId: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: 'New Task',
      description: 'Add description here',
      priority: 'medium'
    };

    updateColumns(prevColumns =>
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

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingCardId(cardId);
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (columnId: string) => {
    setDraggingOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDraggingOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggingOverColumn(null);
    setDraggingCardId(null);
    const cardId = e.dataTransfer.getData('cardId');
    
    updateColumns(prevColumns => {
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
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Kanban Board</h1>
            <p className="text-gray-600">Drag and drop cards between columns to update their status</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-500 mb-1">
              Auto-save enabled • 
              {lastSavedTime ? ` Last saved: ${new Date(lastSavedTime).toLocaleTimeString()}` : ' Not saved yet'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManualSave}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                title="Manually save current state"
              >
                Save
              </button>
              <button
                onClick={handleManualLoad}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                title="Load saved state"
              >
                Load
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                title="Reset to initial state"
              >
                Reset
              </button>
              <button
                onClick={handleClearStorage}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                title="Clear all saved data"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={draggingOverColumn === column.id ? 'ring-2 ring-blue-400 rounded-lg' : ''}
          >
            <KanbanColumn
              title={column.title}
              cards={column.cards}
              columnId={column.id}
              onAddCard={() => handleAddCard(column.id)}
              onCardClick={handleCardClick}
              onDragStart={handleDragStart}
              draggingCardId={draggingCardId}
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