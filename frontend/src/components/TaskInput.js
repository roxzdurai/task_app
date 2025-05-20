import React, { useState } from 'react';

export default function TaskInput({ onAdd }) {
  const [task, setTask] = useState('');

  const handleAdd = () => {
    if (task.trim() === '') {
      alert('Please enter a task before adding.');
      return;
    }
    onAdd(task);
    setTask('');
  };

  return (
    <div>
      <input
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
