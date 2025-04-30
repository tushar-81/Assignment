import PropTypes from 'prop-types';
import { useState, memo, useCallback, useEffect } from 'react';

const TaskItem = memo(({ task, onStatusChange, onEditClick, onDeleteClick }) => {
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
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
            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            title="Edit task"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            title="Delete task"
          >
            Delete
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