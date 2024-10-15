const fs = require("fs");
const path = require("path");

async function getBookImages() {
  const images = fs
    .readdirSync(path.join(__dirname, "..", "public", "img", "bookic"))
    .filter((file) => file.endsWith(".jpg") || file.endsWith(".png"));
  return images;
}

module.exports = { getBookImages };