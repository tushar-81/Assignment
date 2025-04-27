import { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';
import EditTaskForm from './EditTaskForm';

const TaskList = memo(({ tasks, onToggleStatus, onDeleteTask, onEditTask }) => {
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleSaveEdit = useCallback(async (taskId, updatedData) => {
    await onEditTask(taskId, updatedData);
    setEditingTask(null);
  }, [onEditTask]);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id}>
          {editingTask && editingTask._id === task._id ? (
            <EditTaskForm
              task={task}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <TaskItem
              task={task}
              onStatusChange={onToggleStatus}
              onDeleteClick={onDeleteTask}
              onEditClick={handleEdit}
            />
          )}
        </div>
      ))}
    </div>
  );
});

TaskList.displayName = 'TaskList';

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired
};

export default TaskList;