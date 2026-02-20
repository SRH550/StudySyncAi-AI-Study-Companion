const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is healthy' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
