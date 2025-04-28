const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();


const taskValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .trim()
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High')
];


const updateTaskValidation = [
  param('id').isMongoId().withMessage('Invalid task ID format'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  
  body('status')
    .optional()
    .isIn(['complete', 'incomplete']).withMessage('Status must be complete or incomplete')
];


const validateTaskId = [
  param('id').isMongoId().withMessage('Invalid task ID format')
];

router.post('/', auth, taskValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description, priority } = req.body;
    
    const task = new Task({
      title,
      description,
      priority: priority || 'Medium',
      user: req.user._id
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const match = { user: req.user._id };
    
    if (req.query.status) {
      if (req.query.status === 'active') {
        match.status = 'incomplete';
      } else if (req.query.status === 'completed') {
        match.status = 'complete';
      }
    }
    
    const tasks = await Task.find(match).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, validateTaskId, async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id', auth, updateTaskValidation, async (req, res) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'priority'];
    
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }
    
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    
    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, validateTaskId, async (req, res) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;