// Create the quiz-api database and a user with read/write permissions
db = db.getSiblingDB('quiz-api');

db.createUser({
  user: 'quiz_user',
  pwd: 'quiz_password',
  roles: [
    {
      role: 'readWrite',
      db: 'quiz-api'
    }
  ]
});

// Create collections (optional - Mongoose will create them automatically)
db.createCollection('quizzes');
db.createCollection('questions');

print('MongoDB initialized successfully for quiz-api');
