const fs = require('fs');
const path = require('path');

// Setting Up Paths and Utility Functions to Read and Write JSON Data
const indexFilePath = path.join(__dirname, '../data/index.json');
const postsFilePath = path.join(__dirname, '../data/posts.json');
const exploreFilePath = path.join(__dirname, '../data/explore.json');
const messageFilePath = path.join(__dirname, '../data/message.json');
const reelsFilePath = path.join(__dirname, '../data/reels.json');

// Utility functions to read and write JSON data
const readData = () => JSON.parse(fs.readFileSync(indexFilePath, 'utf8'));
const writeData = (data) =>
  fs.writeFileSync(indexFilePath, JSON.stringify(data, null, 2));

const readPosts = () => JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));

const readExplorePosts = () =>
  JSON.parse(fs.readFileSync(exploreFilePath, 'utf8'));
const writeExplorePosts = (data) =>
  fs.writeFileSync(exploreFilePath, JSON.stringify(data, null, 2));

const readMessages = () => JSON.parse(fs.readFileSync(messageFilePath, 'utf8'));

const readReels = () => JSON.parse(fs.readFileSync(reelsFilePath, 'utf8'));
const writeReels = (data) =>
  fs.writeFileSync(reelsFilePath, JSON.stringify(data, null, 2));

// Export utility functions and paths
module.exports = {
  readData,
  writeData,
  readPosts,
  readExplorePosts,
  readMessages,
  writeExplorePosts,
  messageFilePath,
  readReels,
  writeReels
};
