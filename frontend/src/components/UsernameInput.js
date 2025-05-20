import React, { useState } from 'react';

export default function UsernameInput({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim() === '') {
      alert('Please enter a valid name');
      return;
    }
    onLogin(name.trim());
  };

  return (
    <div className="username-input">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSubmit}>Enter</button>
    </div>
  );
}
