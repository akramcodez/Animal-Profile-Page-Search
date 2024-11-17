const fs = require("fs");
const path = require("path");

// Setting Up Paths and Utility Functions to Read and Write JSON Data
const indexFilePath = path.join(__dirname, "../data/index.json");
const postsFilePath = path.join(__dirname, "../data/posts.json");
const exploreFilePath = path.join(__dirname, "../data/explore.json");
const messageFilePath = path.join(__dirname, "../data/message.json");

// Utility functions to read and write JSON data
const readData = () => JSON.parse(fs.readFileSync(indexFilePath, "utf8"));
const writeData = (data) => fs.writeFileSync(indexFilePath, JSON.stringify(data, null, 2));

const readPosts = () => JSON.parse(fs.readFileSync(postsFilePath, "utf8"));

const readExplorePosts = () => JSON.parse(fs.readFileSync(exploreFilePath, "utf8"));

const readMessages = () => JSON.parse(fs.readFileSync(messageFilePath, "utf8"));

// Export utility functions and paths
module.exports = {
    readData,
    writeData,
    readPosts,
    readExplorePosts,
    readMessages,
    messageFilePath
};
