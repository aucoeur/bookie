/* eslint-disable no-console */
const express = require('express');
const exphbs = require('express-handlebars');

const cors = require('cors');
const multer = require('multer');
const path = require('path');
const PImage = require('pureimage');

const detectText = require('./utils/detectText');
const drawBox = require('./utils/drawBox');

const app = express();

app.use(cors());

// Express View Engine for Handlebars
app.engine('.hbars', exphbs({
  extname: '.hbars',
  defaultLayout: 'main',
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbars');

// Public & Uploads Folder
app.use('/public', express.static(`${__dirname}/public`));
app.use('/processed', express.static(`${__dirname}/processed`));

const storage = multer.diskStorage({
  destination: 'processed/',

  // By default, multer removes file extensions so let's add them back
  filename(req, file, cb) {
    cb(null, file.originalname.replace(/\s+/g, '').split('.')[0] + Date.now() + path.extname(file.originalname));
  },
});

function imgFileValidation(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/gim)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter: imgFileValidation,
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/process', upload.single('image'), async (req, res) => {
  // Commented out while testing
  const jsonRes = await detectText(req.file.path);

  const data = await JSON.parse(jsonRes);

  const outputFile = `${req.file.path.split('.')[0]}-annotated.png` || 'out.png';

  await drawBox(req.file.path, data, outputFile, PImage);

  // Display uploaded image
  res.render('index', {
    uploaded: true,
    filename: req.file.filename,
    img: req.file.path,
    annotated: outputFile,
    json: `${req.file.path.split('.')[0]}.json`,
  });
});

app.listen('3000', () => {
  console.log('Server listening on port 3000! http://localhost:3000');
});
