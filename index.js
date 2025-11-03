import express from 'express';
import routes from './routes/tasksRoute.js';
const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/tasks', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});