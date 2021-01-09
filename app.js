/* eslint-disable no-console */
const express = require('express');
const exphbs = require('express-handlebars');

const cors = require('cors');
const multer = require('multer');
const path = require('path');

const detectText = require('./detectText.js');
const app = express();

app.use(cors());

// Express View Engine for Handlebars
app.engine('.hbars', exphbs({
  extname: '.hbars',
  defaultLayout: 'main'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbars');

// Public & Uploads Folder
app.use('/public', express.static(__dirname + '/public'));
app.use('/processed', express.static(__dirname + '/processed'));

const storage = multer.diskStorage({
  destination: 'processed/',

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0] + Date.now() + path.extname(file.originalname));
  }
});

const imgFileValidation = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/gim)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imgFileValidation
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/process', upload.single('image'), async function (req, res) {

  const json_res = await detectText(req.file.path);
  // JSON.stringify(json_res, null, 2);
  // Display uploaded image
  return res.render('index', {
      uploaded: true,
      filename: req.file.filename,
      img: req.file.path,
      json: `${req.file.path.split('.')[0]}.json`
    })
});

app.listen('3000', () => {
  console.log('Server listening on port 3000! http://localhost:3000');
});
