import React from 'react';

interface KanbanCardProps {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  isDragging?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  id,
  title,
  description,
  assignee,
  priority = 'medium',
  tags = [],
  isDragging = false
}) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`kanban-card bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 hover:shadow-lg transition-shadow duration-200 ${isDragging ? 'opacity-50 border-blue-400' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      {assignee && (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs text-gray-600">{assignee.charAt(0)}</span>
            </div>
            <span className="text-xs text-gray-600">{assignee}</span>
          </div>
          <span className="text-xs text-gray-400">#{id}</span>
        </div>
      )}
    </div>
  );
};

export default KanbanCard;