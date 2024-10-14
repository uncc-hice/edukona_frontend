const fs = require('fs');
const path = require('path');
require('dotenv').config();

const filePath = path.join(__dirname, 'public', 'index.html');
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const googleTagId = process.env.REACT_APP_GOOGLE_TAG_ID;
  const result = data.replace(/__GOOGLE_TAG_ID__/g, googleTagId);

  fs.writeFile(filePath, result, 'utf8', (err) => {
    if (err) return console.log(err);
  });
});
