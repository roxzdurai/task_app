import React, { useState, useEffect } from 'react';
import './App.css';
import UsernameInput from './components/UsernameInput';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ReminderModal from './components/ReminderModal';

export default function App() {
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalId, setModalId] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch all users on first load
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) fetchTasks(savedUser);
  }, []);

  const fetchTasks = (name) => {
    fetch(`http://localhost:5000/api/tasks/${name}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setUsername(name);
          localStorage.setItem('username', name);
          setTasks(data);
        } else {
          const confirmCreate = window.confirm(`No tasks found for ${name}. Start as a new user?`);
          if (confirmCreate) {
            setUsername(name);
            localStorage.setItem('username', name);
            setTasks([]);
          }
        }
      });
  };

  const handleLogin = name => {
    fetchTasks(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setTasks([]);
  };

  const addTask = task => {
    fetch('http://localhost:5000/api/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, task }),
    })
      .then(res => res.json())
      .then(data => {
        setTasks(prev => [
          ...prev,
          { id: data.id, task, is_done: 0, reminder: null, username }
        ]);
      });
  };

  const toggleDone = id => {
    const task = tasks.find(t => t.id === id);
    const is_done = task.is_done ? 0 : 1;

    fetch('http://localhost:5000/api/tasks/done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_done }),
    });

    setTasks(tasks.map(t => (t.id === id ? { ...t, is_done } : t)));
  };

  const openReminderModal = id => {
    setModalId(id);
  };

  const handleReminderSet = reminder => {
    fetch('http://localhost:5000/api/tasks/reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: modalId, reminder }),
    });

    setTasks(tasks.map(t => (t.id === modalId ? { ...t, reminder } : t)));
    setModalId(null);
  };

  const deleteTask = id => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    fetch('http://localhost:5000/api/tasks/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then(() => {
      setTasks(tasks.filter(t => t.id !== id));
    });
  };

  return (
    <div className="container">
      {!username ? (
        <>
          <UsernameInput onLogin={handleLogin} />
          <div className="summary">
            <h3>Existing Users:</h3>
            <ul>
              {users.map((u, idx) => (
                <li key={idx}>{u}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Welcome, {username}</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <TaskInput onAdd={addTask} />
          <div className="summary">
            <strong>Summary:</strong>{' '}
            Total: {tasks.length} | Done: {tasks.filter(t => t.is_done).length} | Pending:{' '}
            {tasks.filter(t => !t.is_done).length}
          </div>
          <TaskList
            tasks={tasks}
            onToggleDone={toggleDone}
            onReminder={openReminderModal}
            onDelete={deleteTask}
          />
        </>
      )}

      {modalId && (
        <ReminderModal
          onSet={handleReminderSet}
          onClose={() => setModalId(null)}
        />
      )}
    </div>
  );
}
