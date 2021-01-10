function drawBox(imageFile, data) {
  const image = document.getElementById('image');

  const canvas = document.createElement('canvas');
  canvas.id     = "canvas";
  canvas.width  = image.clientWidth;
  canvas.height = image.clientHeight;

  document.body.appendChild(canvas);

  const context = document.getElementById('canvas').getContext('2d');
  const img = new Image(image.clientWidth, image.clientHeight);
  // let json = JSON.stringify(jsonData);
  // json = JSON.parse(json);
  img.onload = function () {
    //   // const context = img.getContext('2d');

    context.drawImage(img, 0, 0);

      // Now draw boxes around all the text
      context.strokeStyle = 'rgba(0,255,0,0.8)';
      context.lineWidth = '5';

      data.forEach(box => {
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
  }

  img.src = imageFile;
}

module.exports = drawBox;
