// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");
// const path = require("path");

// const {
//   readData,
//   writeData,
//   readPosts,
//   readExplorePosts,
//   readMessages
// } = require("./filePaths");

// const isInvalidId = (id) => {
//   return id === "no" || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
// };

// const updateIds = (data, key) => {
//   let needsUpdate = false;
//   data.forEach((entry) => {
//     if (entry[key]) {
//       entry[key] = entry[key].map((item) => {
//         if (isInvalidId(item.id)) {
//           needsUpdate = true;
//           return { ...item, id: uuidv4() };
//         }
//         return item;
//       });
//     }
//   });
//   return needsUpdate;
// };

// const indexData = readData();
// const indexNeedsUpdate = updateIds(Object.values(indexData), "posts");

// if (indexNeedsUpdate) {
//   writeData(indexData);
// }

// const exploreData = readExplorePosts();
// const exploreNeedsUpdate = updateIds(exploreData, "pic");

// if (exploreNeedsUpdate) {
//   writeData(exploreData);
// }
