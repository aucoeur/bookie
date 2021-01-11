/* eslint-disable no-console */
const fs = require('fs');

async function drawBox(inputFile, data, outputFile, PImage) {
  // Open the original image
  const stream = fs.createReadStream(inputFile);

  let promise;

  if (inputFile.match(/\.jpg$/)) {
    promise = PImage.decodeJPEGFromStream(stream);
  } else if (inputFile.match(/\.png$/)) {
    promise = PImage.decodePNGFromStream(stream);
  } else {
    throw new Error(`Unknown filename extension ${inputFile}`);
  }

  const img = await promise;
  const context = img.getContext('2d');

  context.drawImage(img, 0, 0, img.width, img.height, 0, 0);

  // Draw boxes around all the text
  context.strokeStyle = 'rgba(0,255,0,0.8)';
  context.lineWidth = 4;
  context.lineJoin = 'round';

  data.forEach((box) => {
    context.beginPath();
    let origX = 0;
    let origY = 0;
    box.boundingPoly.vertices.forEach((bounds, i) => {
      if (i === 0) {
        origX = bounds.x;
        origY = bounds.y;
        context.moveTo(bounds.x, bounds.y);
      } else {
        context.lineTo(bounds.x, bounds.y);
      }
    });
    context.lineTo(origX, origY);
    context.stroke();
  });

  // Write the result to a file
  console.log(`Saving annotated image to file ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile);
  await PImage.encodePNGToStream(img, writeStream);
}

module.exports = drawBox;
