import React, { useState } from 'react';

export default function ReminderModal({ onSet, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = () => {
    if (!date || !time) {
      alert('Please enter both date and time.');
      return;
    }
    onSet(`${date} ${time}`);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Set Reminder</h3>
        <input type="date" onChange={e => setDate(e.target.value)} />
        <input type="time" onChange={e => setTime(e.target.value)} />
        <br />
        <button onClick={handleSubmit}>Set Reminder</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
    