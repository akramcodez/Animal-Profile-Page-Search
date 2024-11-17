const express = require('express');
const fs = require('fs');
const {
  readMessages,
  readData,
  messageFilePath,
} = require('../utils/filePaths');
const autoReplies = require('../config/autoReplies');

const router = express.Router();

// Route: Render Message Page for a User
router.get('/ig/message/:user', (req, res) => {
  res.render('message/message.ejs');
});

// Route: Get Messages Between Two Users
router.get('/messages/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  const messages = readMessages();
  const chat = (messages[user1] && messages[user1][user2]) || [];

  // Fetch matching user details
  const data = readData();
  const matchedUsers = Object.keys(data)
    .filter((username) => username.toLowerCase().includes(user2))
    .map((username) => ({
      username,
      profile: data[username].profile,
      name: data[username].name,
    }));

  res.json({ messages: chat, detail: matchedUsers });
});

// Route: Send a New Message
router.post('/messages/:sender/:receiver', (req, res) => {
  const { sender, receiver } = req.params;
  const { message } = req.body;
  const lowerCaseMessage = message.toLowerCase();
  const timestamp = new Date().toISOString();

  // Load current data from message.json
  fs.readFile(messageFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading message data');
    }

    const messages = JSON.parse(data);

    // Ensure sender and receiver data exists
    if (!messages[sender]) {
      messages[sender] = {};
    }
    if (!messages[sender][receiver]) {
      messages[sender][receiver] = [];
    }

    // Add new message to conversation
    messages[sender][receiver].push({ sender, message, timestamp });

    // Save updated data to message.json
    fs.writeFile(
      messageFilePath,
      JSON.stringify(messages, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).send('Error saving message data');
        }
      },
    );
  });

  // Handle auto-reply logic
  let autoReplyMessage = null;
  for (const keyword in autoReplies) {
    if (lowerCaseMessage.includes(keyword)) {
      autoReplyMessage = autoReplies[keyword];
      break;
    } else {
      autoReplyMessage = "I don't wanna reply with that. Sorry! :(";
    }
  }

  if (autoReplyMessage) {
    res.json({ autoReply: autoReplyMessage });
  } else {
    res.json({ success: true });
  }
});

module.exports = router;
