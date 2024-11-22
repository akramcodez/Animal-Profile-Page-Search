
/*
 * NOTE:
 * When adding a new explore post, a new user, or posts for any user,
 * come to this file to update IDs to the correct UUID format.
 * This ensures consistency across the application.
 */

const { v4: uuidv4 } = require("uuid");

const {
  readData,
  writeData,
  readExplorePosts,
  writeExplorePosts,
  readReels,
  writeReels
} = require("./filePaths");

const isInvalidId = (id) => {
  return id === "no" || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
};

const updateIds = (data, key) => {
  let needsUpdate = false;
  data.forEach((entry) => {
    if (entry[key]) {
      entry[key] = entry[key].map((item) => {
        if (isInvalidId(item.id)) {
          needsUpdate = true;
          return { ...item, id: uuidv4() };
        }
        return item;
      });
    }
  });
  return needsUpdate;
};

const indexData = readData();
const indexNeedsUpdate = updateIds(Object.values(indexData), "posts");

if (indexNeedsUpdate) {
  writeData(indexData);
}

const exploreData = readExplorePosts();
const exploreNeedsUpdate = updateIds(exploreData, "pic");

if (exploreNeedsUpdate) {
  writeExplorePosts(exploreData);
}


const updateIdsInArray = (data) => {
  let needsUpdate = false;

  data.forEach((item) => {
    if (isInvalidId(item.id)) {
      needsUpdate = true;
      item.id = uuidv4();
    }
  });

  return needsUpdate;
};

const reelsData = readReels();
const reelsNeedsUpdate = updateIdsInArray(reelsData);

if (reelsNeedsUpdate) {
  writeReels(reelsData);
}
