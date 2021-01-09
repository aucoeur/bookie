/* eslint-disable no-console */
const express = require('express');
const exphbs = require('express-handlebars');

const cors = require('cors');
const multer = require('multer');
const path = require('path');

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
app.use('/uploads', express.static(__dirname + '/uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',

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

app.post('/', upload.single('image'), function (req, res) {
  // Display uploaded image
  res.render('index', {
      uploaded: true,
      img: req.file.path
    })
});

app.listen('3000', () => {
  console.log('Server listening on port 3000! http://localhost:3000');
});
