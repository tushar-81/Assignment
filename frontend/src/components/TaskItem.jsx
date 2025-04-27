import PropTypes from 'prop-types';
import { useState, memo, useCallback, useEffect } from 'react';

const TaskItem = memo(({ task, onStatusChange, onEditClick, onDeleteClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(task.status === 'complete');
  
  
  useEffect(() => {
    setIsChecked(task.status === 'complete');
  }, [task.status]);
  
  
  const priorityStyles = {
    High: 'bg-red-100 text-red-800 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };

  const handleStatusChange = useCallback(() => {

    setIsChecked(!isChecked);
    
  
    onStatusChange(task._id, task.status);
  }, [isChecked, onStatusChange, task._id, task.status]);

  const handleEdit = useCallback(() => {
    onEditClick(task);
  }, [onEditClick, task]);

  const handleDelete = useCallback(() => {
    onDeleteClick(task._id);
  }, [onDeleteClick, task._id]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3 transition-all duration-200 ${isHovered ? 'shadow-md transform translate-y-[-2px]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              checked={isChecked}
              onChange={handleStatusChange}
            />
            <h3 className={`ml-2 text-lg font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <p className={`mt-1 text-sm text-gray-500 ml-6 ${isChecked ? 'line-through' : ''}`}>
            {task.description}
          </p>
          <div className="mt-2 ml-6 text-xs text-gray-400">
            Added on {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
            aria-label="Edit task"
            title="Edit task"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 focus:outline-none"
            aria-label="Delete task"
            title="Delete task"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};

export default TaskItem;