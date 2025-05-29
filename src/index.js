import express from 'express';  // Import express for building the API
import mongoose from 'mongoose';  // Import mongoose for MongoDB connection
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas
const uri = "mongodb+srv://antidogmatism:F7zyy07qjntdBkc8@cluster0.5ar5xq8.mongodb.net/nz_ufc_test?retryWrites=true&w=majority";
mongoose.connect(uri);

// Define Fighters schema
const fighterSchema = new mongoose.Schema({
  name: String,
  nickname: String,
  age: Number,
  weightClass: String,
  wins: Number,
  losses: Number,
  isActive: Boolean, // Boolean to indicate if the fighter is currently active
  fightingStyles: Array
 
})

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
  return { wins: this.wins, losses: this.losses, isActive: this.isActive };
};

// Create Fighter model
const Fighter = mongoose.model('Fighter', fighterSchema);

// GET /fighters - Return all fighters
app.get('/fighters', async (_, res) => {
  try {
    const fighters = await Fighter.find();
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /fighters - Create a new fighter
app.post('/fighters', async (req, res) => {
  try {
    const fighter = new Fighter(req.body);
    await fighter.save();
    res.status(201).json(fighter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /fighters/:id - Return a specific fighter by MongoDB _id
app.get('/fighters/:id', async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);
    if (!fighter) {
      return res.status(404).json({ error: 'Fighter not found' });
    }
    res.json(fighter);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// GET /fighters/weightclass/:weightClass - Return all fighters by weight class
app.get('/fighters/weightclass/:weightClass', async (req, res) => {
  try {
    const fighters = await Fighter.find({ weightClass: req.params.weightClass });
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fighters/active', async (req, res) => {
  try {
    const activeFighters = await Fighter.find({ isActive: true });
    if (!activeFighters || activeFighters.length === 0) {
      return res.status(404).json({ error: 'No active fighters found' });
    }
    res.json(activeFighters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});