import React from 'react';

export default function TaskList({ tasks, onToggleDone, onReminder, onDelete }) {
  return (
    <div>
      {tasks.map(task => (
        <div className={`task ${task.is_done ? 'done' : ''}`} key={task.id}>
          <div style={{ flex: 1 }}>
            <span>{task.task}</span>
            {task.reminder && (
              <div style={{ fontSize: '12px', color: '#888' }}>
                ⏰ Reminder: {new Date(task.reminder).toLocaleString()}
              </div>
            )}
          </div>
          <div>
            <button onClick={() => onReminder(task.id)}>Reminder</button>
            <button onClick={() => onToggleDone(task.id)}>
              {task.is_done ? 'Undone' : 'Done'}
            </button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
