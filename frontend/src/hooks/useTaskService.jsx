import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const useTaskService = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }, []);

  
  const handleUnauthorized = useCallback(() => {
    logout();
  }, [logout]);

  
  const fetchTasks = useCallback(async (status = '') => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_URL}/tasks${status ? `?status=${status}` : ''}`;
      const response = await axios.get(url, getAuthHeader());
      
      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      
      if (err.response && err.response.status === 401) {
        handleUnauthorized();
      } else {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      }
    }
  }, [user, getAuthHeader, handleUnauthorized]);

  
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/tasks`, taskData, getAuthHeader());
      
      setTasks(prevTasks => [response.data, ...prevTasks]);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      
      if (err.response && err.response.status === 401) {
        handleUnauthorized();
      } else {
        setError(err.response?.data?.message || 'Failed to create task');
      }
      return null;
    }
  }, [getAuthHeader, handleUnauthorized]);

  
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.patch(`${API_URL}/tasks/${taskId}`, taskData, getAuthHeader());
      
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === taskId ? response.data : task)
      );
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      
      if (err.response && err.response.status === 401) {
        handleUnauthorized();
      } else {
        setError(err.response?.data?.message || 'Failed to update task');
      }
      return null;
    }
  }, [getAuthHeader, handleUnauthorized]);

  
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`${API_URL}/tasks/${taskId}`, getAuthHeader());
      
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      
      if (err.response && err.response.status === 401) {
        handleUnauthorized();
      } else {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
      return false;
    }
  }, [getAuthHeader, handleUnauthorized]);

  
  const toggleTaskStatus = useCallback(async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';
    return await updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  };
};

export default useTaskService;