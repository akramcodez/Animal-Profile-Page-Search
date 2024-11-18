const express = require('express');
const fs = require('fs');
const expressError = require('../utils/expressError.js');
const {
  readMessages,
  readData,
  messageFilePath,
} = require('../utils/filePaths');
const autoReplies = require('../config/autoReplies');

const router = express.Router();

// Route: Render Message Page for a User
router.get('/ig/message/:user', (req, res, next) => {
  const { user } = req.params;
  const data = readData();

  // Check if the user exists
  if (!data[user]) {
    return next(new expressError(404, 'User not found'));
  }

  res.render('message/message.ejs', { user });
});

// Route: Get Messages Between Two Users
router.get('/messages/:user1/:user2', (req, res, next) => {
  const { user1, user2 } = req.params;
  const messages = readMessages();

  if (!messages[user1] || !messages[user1][user2]) {
    return next(new expressError(404, 'No messages found between the users'));
  }

  const chat = messages[user1][user2];

  // Fetch matching user details
  const data = readData();
  const matchedUsers = Object.keys(data)
    .filter((username) => username.toLowerCase().includes(user2))
    .map((username) => ({
      username,
      profile: data[username].profile,
      name: data[username].name,
    }));

  if (matchedUsers.length === 0) {
    return next(new expressError(404, 'No matching users found'));
  }

  res.json({ messages: chat, detail: matchedUsers });
});

// Route: Send a New Message
router.post('/messages/:sender/:receiver', (req, res, next) => {
  const { sender, receiver } = req.params;
  const { message } = req.body;

  // Validate input
  if (!message || typeof message !== 'string' || !message.trim()) {
    return next(new expressError(400, 'Message cannot be empty'));
  }

  const lowerCaseMessage = message.toLowerCase();
  const timestamp = new Date().toISOString();

  // Load current data from message.json
  fs.readFile(messageFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return next(new expressError(500, 'Error reading message data'));
    }

    let messages;
    try {
      messages = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return next(new expressError(500, 'Error parsing message data'));
    }

    // Ensure sender and receiver data exists
    if (!messages[sender]) {
      messages[sender] = {};
    }
    if (!messages[sender][receiver]) {
      messages[sender][receiver] = [];
    }

    // Add new message to conversation
    messages[sender][receiver].push({ sender, message, timestamp });
    
    // Handle auto-reply logic
    let autoReplyMessage = null;
    for (const keyword in autoReplies) {
      if (lowerCaseMessage.includes(keyword)) {
        autoReplyMessage = autoReplies[keyword];
        break;
      }
    }

    autoReplyMessage =
      autoReplyMessage || "I don't wanna reply with that. Sorry! :(";

    res.json({ success: true, autoReply: autoReplyMessage });
  });
});

module.exports = router;
