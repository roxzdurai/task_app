const express = require('express');
const router = express.Router();
const db = require('../db');

db.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    task TEXT,
    is_done BOOLEAN DEFAULT FALSE,
    reminder DATETIME DEFAULT NULL
)`, err => {
  if (err) throw err;
});

 
router.post('/add', (req, res) => {
  const { username, task } = req.body;
  db.query('INSERT INTO tasks (username, task) VALUES (?, ?)', [username, task], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId });
  });
});

 
router.get('/:username', (req, res) => {
  db.query('SELECT * FROM tasks WHERE username = ?', [req.params.username], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

 
router.post('/reminder', (req, res) => {
  const { id, reminder } = req.body;
  db.query('UPDATE tasks SET reminder = ? WHERE id = ?', [reminder, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});

 
router.post('/done', (req, res) => {
  const { id, is_done } = req.body;
  db.query('UPDATE tasks SET is_done = ? WHERE id = ?', [is_done, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});

router.post('/delete', (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).send(err);
    }
    res.send({ success: true });
  });
});


router.get('/', (req, res) => {
  const sql = 'SELECT DISTINCT username FROM tasks';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    const users = results.map(r => r.username);
    res.json(users);
  });
});

module.exports = router;
