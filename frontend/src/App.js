import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/channels')
      .then(res => setChannels(res.data))
      .catch(err => alert('Error fetching channels'));
  }, []);

  const handleSend = () => {
    if (!selectedChannel || !message) {
      alert('Please select a channel and write a message');
      return;
    }
    axios.post('http://localhost:5000/api/send', { channelId: selectedChannel, message })
      .then(() => alert('Message sent!'))
      .catch(() => alert('Failed to send message'));
  };

  return (
    <div className="App">
      <h1>Send Message to Slack</h1>
      <textarea
        placeholder="Enter your message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <select value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
        <option value="">Select Channel</option>
        {channels.map(channel => (
          <option key={channel.id} value={channel.id}>{channel.name}</option>
        ))}
      </select>
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default App;