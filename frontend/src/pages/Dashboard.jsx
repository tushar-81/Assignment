import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import useTaskService from '../hooks/useTaskService';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Header from '../components/Header';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTaskService();
  const [filter, setFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const activeTasksCount = allTasks.filter(task => task.status === 'incomplete').length;

  useEffect(() => {
    document.title = 'Task Manager - Dashboard';
  }, []);

  useEffect(() => {
    const fetchAllTasks = async () => {
      await fetchTasks();
    };
    
    if (user) {
      fetchAllTasks();
    }
  }, [user, fetchTasks]);

  useEffect(() => {
    setAllTasks(tasks);
    
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else if (filter === 'active') {
      setFilteredTasks(tasks.filter(task => task.status === 'incomplete'));
    } else if (filter === 'completed') {
      setFilteredTasks(tasks.filter(task => task.status === 'complete'));
    }
  }, [tasks, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    if (newFilter === 'all') {
      setFilteredTasks(allTasks);
    } else if (newFilter === 'active') {
      setFilteredTasks(allTasks.filter(task => task.status === 'incomplete'));
    } else if (newFilter === 'completed') {
      setFilteredTasks(allTasks.filter(task => task.status === 'complete'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}!</h1>
          <p className="mt-2 text-gray-600">
            You have {activeTasksCount} active {activeTasksCount === 1 ? 'task' : 'tasks'} to complete.
          </p>
        </div>

        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap">
            <div>
              <h2 className="text-xl font-medium text-gray-900">Your Tasks</h2>
              <p className="mt-1 text-sm text-gray-500">
                Stay organized and boost your productivity
              </p>
            </div>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {showAddTask ? 'Cancel' : 'Add New Task'}
            </button>
          </div>
          
          {showAddTask && <TaskForm onAddTask={createTask} onCancel={() => setShowAddTask(false)} />}
          
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    filter === 'all'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('active')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    filter === 'active'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleFilterChange('completed')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    filter === 'completed'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
              
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
              
            {loading ? (
              <div className="text-center py-10">
                Loading tasks...
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onToggleStatus={toggleTaskStatus}
                onDeleteTask={deleteTask}
                onEditTask={updateTask}
              />
            )}
              
            {!loading && filteredTasks.length === 0 && (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded">
                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    New Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;