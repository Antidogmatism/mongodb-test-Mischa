const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://antidogmatism:F7zyy07qjntdBkc8@cluster0.5ar5xq8.mongodb.net/myFirstDataBase?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Fighters schema
const fighterSchema = new mongoose.Schema({
  name: String,
  age: Number,
  weightClass: String,
  record: {
    wins: Number,
    losses: Number,
    draws: Number,
    isActive: Boolean,
    fightingStyles: [String],
  }
});
mongoose.getConnection().once('open', () => {
    console.log('Connected to MongoDB');
});
// Optionally, add instance methods
fighterSchema.methods.getName = function() {
  return this.name;
};
fighterSchema.methods.getAge = function() {
  return this.age;
};
fighterSchema.methods.getWeightClass = function() {
  return this.weightClass;
};
fighterSchema.methods.getRecord = function() {
  return this.record;
};


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});