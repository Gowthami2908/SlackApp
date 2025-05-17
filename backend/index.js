const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_API = 'https://slack.com/api';

// Get public Slack channels
app.get('/api/channels', async (req, res) => {
  try {
    const response = await axios.get(`${SLACK_API}/conversations.list`, {
      headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
      params: { types: 'public_channel' }
    });
    if (!response.data.ok) {
      // Slack API returned an error response
      console.error("Slack API returned error:", response.data.error);
      return res.status(500).json({ error: `Slack API error: ${response.data.error}` });
    }
    res.json(response.data.channels);
  } catch (error) {
    console.error("Slack API Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch channels', details: error.response?.data || error.message });
  }
});

// Post message to selected Slack channel
app.post('/api/send', async (req, res) => {
  const { channelId, message } = req.body;
  try {
    const response = await axios.post(`${SLACK_API}/chat.postMessage`, {
      channel: channelId,
      text: message
    }, {
      headers: { Authorization: `Bearer ${SLACK_TOKEN}` }
    });
    if (!response.data.ok) {
      console.error("Slack API returned error:", response.data.error);
      return res.status(500).json({ error: `Slack API error: ${response.data.error}` });
    }
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Slack API Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send message', details: error.response?.data || error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
