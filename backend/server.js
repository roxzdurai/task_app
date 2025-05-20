
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/tasks', require('./routes/tasks'));


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
