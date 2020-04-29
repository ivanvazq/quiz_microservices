const express = require('express');
const router = express.Router();
var app = express();
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');


const quizController = require('./controller/quizController');


// Autoload for routes using :quizId
router.param('quizId', quizController.load);

// Routes for the resource /quizzes
router.get('/api/quizzes', quizController.index);

router.get('/api/quizzes/:quizId(\\d+)', quizController.show);

router.get('/api/quizzes/new', quizController.new);

router.post('/api/quizzes', quizController.create);

// router.get('/api/quizzes/:quizId(\\d+)/edit', quizController.edit);

router.put('/api/quizzes/:quizId(\\d+)', quizController.update);

router.delete('/api/quizzes/:quizId(\\d+)', quizController.destroy);

router.get('/api/quizzes/:quizId(\\d+)/play', quizController.play);
router.get('/api/quizzes/:quizId(\\d+)/check', quizController.check);




const port = 3001;


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(partials());


app.use(router)
app.listen(port);