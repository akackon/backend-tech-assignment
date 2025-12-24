// Create the quiz-api database and a user with read/write permissions
const dbName = process.env.MONGO_INITDB_DATABASE || "quiz-api";
const appUser = process.env.MONGO_APP_USER || "quiz_user";
const appPassword = process.env.MONGO_APP_PASSWORD || "quiz_password";

db = db.getSiblingDB(dbName);

db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [
    {
      role: "readWrite",
      db: dbName,
    },
  ],
});

// Create collections (optional - Mongoose will create them automatically)
db.createCollection("quizzes");
db.createCollection("questions");

print("MongoDB initialized successfully for " + dbName);
print("Created user: " + appUser);
