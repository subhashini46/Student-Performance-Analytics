const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_performance_analytics";

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = {
  connectDB
};
