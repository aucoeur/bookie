/* eslint-disable no-console */
const fs = require('fs');
const vision = require('@google-cloud/vision');

// const path = './public/images/';
// const fileName = 'books_1.jpg';
// const file = path + fileName;

async function detectText(file) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs text detection on the local file
  const [result] = await client.textDetection(file);
  const detections = result.textAnnotations;

  const toJSON = JSON.stringify(detections, null, 2);

  const log = fs.createWriteStream(`${file.split('.')[0]}.json`, {
    flags: 'a',
  });

  console.log('Writing annotations to file...');
  log.write(toJSON);
  console.log('Data write complete');
  return toJSON;
}

module.exports = detectText;
