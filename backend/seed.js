const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task-management')
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seedData();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    
    const user1 = new User({
      name: 'Test User 1',
      email: 'test1@example.com',
      password: 'password123'
    });
    
    const user2 = new User({
      name: 'Test User 2',
      email: 'test2@example.com',
      password: 'password123'
    });
    
    await user1.save();
    await user2.save();
    
    console.log('Test users created');
    
    const tasksUser1 = [
      {
        title: 'Complete React Assignment',
        description: 'Finish the task management app',
        priority: 'High',
        user: user1._id
      },
      {
        title: 'Go Grocery Shopping',
        description: 'Buy fruits, vegetables, and bread',
        priority: 'Medium',
        user: user1._id
      },
      {
        title: 'Read a Book',
        description: 'Read at least 30 pages of the new novel',
        priority: 'Low',
        status: 'complete',
        user: user1._id
      }
    ];
    
    const tasksUser2 = [
      {
        title: 'Gym Session',
        description: 'Cardio and weight training',
        priority: 'Medium',
        user: user2._id
      },
      {
        title: 'Pay Bills',
        description: 'Electricity and water bills',
        priority: 'High',
        user: user2._id
      }
    ];
    
    await Task.insertMany([...tasksUser1, ...tasksUser2]);
    console.log('Sample tasks created');
    
    console.log('Database seeding completed!');
    console.log('Test User 1 - Email: test1@example.com, Password: password123');
    console.log('Test User 2 - Email: test2@example.com, Password: password123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    mongoose.connection.close();
  }
};