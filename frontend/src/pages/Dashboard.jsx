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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
     
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back, {user?.name || 'User'}!</h1>
          <p className="mt-2 text-gray-600">
            You have {activeTasksCount} active {activeTasksCount === 1 ? 'task' : 'tasks'} to complete.
          </p>
        </div>

     
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center flex-wrap">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
              <p className="mt-1 text-sm text-gray-500">
                Stay organized and boost your productivity
              </p>
            </div>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {showAddTask ? 'Cancel' : 'Add New Task'}
            </button>
          </div>
          
          {showAddTask && <TaskForm onAddTask={createTask} onCancel={() => setShowAddTask(false)} />}
          
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    filter === 'all'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('active')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    filter === 'active'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleFilterChange('completed')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    filter === 'completed'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
              
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
              
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
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