const express = require('express');
const router = express.Router();
var app = express();
var path = require('path');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const location = require('location')

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var partials = require('express-partials');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// const quizController = require('./quizController');

const quizzes = "http://localhost:3001/api/quizzes";
const users = "http://localhost:3003/api/users"


// // Autoload for routes using :quizId
// router.param('quizId', quizController.load);

const accessTokenSecret = 'youraccesstokensecret';


const authenticateJWT = express.Router();

authenticateJWT.use((req, res, next) => {

    fetch("http://localhost:3003/api/login")
    .then(res => res.json())
    .then(token => {
        console.log(token);
        token = token[0];
        if (token) {
            jwt.verify(token, accessTokenSecret, (err, decoded) => {      
                if (err) {
                    return res.render('badPass')    
                } else {
                    req.decoded = decoded;    
                    next();
                }
            });
        } else {
            // res.send({ 
            //     mensaje: 'Token no proveída.' 
            // });
            res.render('notLog');
        }
        
    }).catch(err => {throw err});

});


router.get('/', authenticateJWT, (req, res, next) => {
    
    fetch("http://localhost:3003/api/login")
    .then(res => res.json())
    .then(token => {
        console.log(token);
        res.render('index');
    }).catch(err => {throw err});
    // res.render('index')

});


//////////// Routes for the resource /quizzes /////////////////

//GET all quizzes
router.get('/quizzes', authenticateJWT, (req, res, next) => {

    fetch(quizzes)
        .then(res => res.json())
        .then((out) => {
            fetch('http://localhost:3005/api/fav/')
                .then(res => res.json())
                .then((fav) => {
                    for(var i in fav.favs){
                        if(res.locals.user === fav.favs[i].user){
                            favoritos = fav.favs[i].fav    //Saca todos los favs que ha hecho el user
                            console.log(favoritos)
                            // favoritos = [null,false,true,true,true,null,true,false,true];
                            res.render('quizzes/index', {out, favoritos})
                        }
                    }
                })

            // res.render('quizzes/index', out);
        }).catch(err => {throw err});

});


//Show Quiz
router.get('/quizzes/:id(\\d+)', authenticateJWT, (req, res, next) => {

    fetch('http://localhost:3001/api/quizzes/'+req.params.id)
        .then(res => res.json())
        .then((out) => {
            res.render('quizzes/show', out);
        }).catch(err => { throw err });

});


//New Quiz

router.get('/quizzes/new', authenticateJWT, (req, res, next) => {

    fetch('http://localhost:3001/api/quizzes/new')
        .then(res => res.json())
        .then((out) => {
            res.render('quizzes/new', out);
        }).catch(err => {throw err});

 });

router.post('/quizzes', authenticateJWT, (req, res, next) => {

    const {question, answer} = req.body;
    const author = res.locals.user;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3001/api/quizzes';
    xhr.open("POST", url, true);
    // console.log(question)
    var data = JSON.stringify({question, answer, author});
    console.log(data)
    xhr.send(data);
    res.redirect('/quizzes');


});

// Edit Quiz

router.get('/quizzes/:id(\\d+)/edit', authenticateJWT, (req, res, next) => {

    fetch('http://localhost:3001/api/quizzes/' + req.params.id)
        .then(res => res.json())
        .then((out) => {
            res.render('quizzes/edit', out);
        }).catch(err => { throw err });
});

// Update edited quiz

router.put('/quizzes/:id(\\d)', authenticateJWT, (req, res, next) => {
    
    const {question, answer} = req.body;
    console.log(question)

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3001/api/quizzes/' + req.params.id;
    xhr.open("PUT", url, true);
    var data = JSON.stringify({ question, answer});
    console.log(data)
    xhr.send(data);
    res.redirect('/quizzes');

});



//DELETE FUNCIONA A MEDIAS
router.delete('/quizzes/:id(\\d+)', authenticateJWT, (req, res, next) => {


    fetch('http://localhost:3001/api/quizzes/'+req.params.id)
        .then(res => res.json())
        .then((out) => {
            let xhr = new XMLHttpRequest();
            let url = 'http://localhost:3001/api/quizzes/' + req.params.id;
            xhr.open("DELETE", url, true);
            var data = JSON.stringify(out);
            xhr.send(data);
            console.log(out)
            res.redirect('/quizzes');

        }).catch(err => { throw err });

});

router.get('/quizzes/:id(\\d+)/play', (req, res, next) => {
    fetch('http://localhost:3001/api/quizzes/'+req.params.id+'/play')
        .then(res => res.json())
        .then((out) => {
            fetch('http://localhost:3004/api/tips/' + req.params.id)
            .then(res => res.json())
            .then(tips => {
                console.log(tips)
                res.render('quizzes/play', {out, tips})
            })
        }).catch(err => { throw err });
    
});


router.get('/quizzes/:id(\\d+)/check', (req, res, next) => {
    
    const {query} = req;

    fetch('http://localhost:3001/api/quizzes/'+req.params.id)
        .then(res => res.json())
        .then((out) => {
            const answer = query.answer || "";
            const result = answer.toLowerCase().trim() === out.quiz.answer.toLowerCase().trim();

            res.render('quizzes/result',{
                out,
                result,
                answer
            });
        });

});


/////////////// Routes for the resource /login ////////////////
router.get('/login', (req, res, next) => {
    res.render('login')
});

router.post('/login', (req, res, next) => {

    const {username, password} = req.body;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3003/api/login';
    xhr.open("POST", url, true);
    var data = JSON.stringify({ username, password });
    //console.log(data)
    xhr.send(data);
    res.redirect('/loged');
    // next();

});

router.get('/loged', (req, res, next) => {
    
    res.render('loged');

});

router.get('/logout', (req, res, next) => {
    
    const a = 1;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3003/api/logout';
    xhr.open("POST", url, true);
    var data = JSON.stringify(a);
    //console.log(data)
    xhr.send(data);
    res.redirect('/');
})




// //////////// Routes for the resource /users /////////////////

//GET all users
router.get('/users', (req, res, next) => {

    fetch('http://localhost:3003/api/users/')
        .then(res => res.json())
        .then((out) => {
            res.render('users/index', out);
        }).catch(err => {throw err});

});

//Show User
router.get('/users/:id(\\d+)', (req, res, next) => {

    fetch('http://localhost:3003/api/users/'+req.params.id)
        .then(res => res.json())
        .then((out) => {
            res.render('users/show', out);
        }).catch(err => { throw err });

});

//GET USER quizzes
router.get('/users/:id(\\d+)/quizzes', authenticateJWT, (req, res, next) => {

    fetch(quizzes)
        .then(res => res.json())
        .then((out) => {
            fetch('http://localhost:3005/api/fav/')
                .then(res => res.json())
                .then((fav) => {
                    for(var i in fav.favs){
                        if(res.locals.user === fav.favs[i].user){
                            favoritos = fav.favs[i].fav    //Saca todos los favs que ha hecho el user
                            res.render('quizzes/userQuizzes', {out, favoritos})
                        }
                    }
                })

            // res.render('quizzes/index', out);
        }).catch(err => {throw err});

});

//EDIT user
router.get('/users/:id(\\d+)/edit', (req, res, next) => {

    fetch('http://localhost:3003/api/users/' + req.params.id)
        .then(res => res.json())
        .then((out) => {
            res.render('users/edit', out);
        }).catch(err => { throw err });

})

router.put('/users/:id(\\d+)', (req, res, next) => {
    
    const body = req.body;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3003/api/users/' + req.params.id;
    xhr.open("PUT", url, true);
    var data = JSON.stringify(body);
    console.log(data)
    xhr.send(data);

    res.redirect('/users/'+req.params.id);

})


//Create new user
router.get('/users/new', (req, res, next) => {
    fetch('http://localhost:3003/api/users/new')
        .then(res => res.json())
        .then((out) => {
            res.render('users/new', out);
        }).catch(err => {throw err});
});



router.post('/users', (req, res, next) => {

    const {username, password} = req.body;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3003/api/users';
    xhr.open("POST", url, true);
    var data = JSON.stringify({ username, password });
    console.log(data)
    xhr.send(data);
    res.redirect('/users');

});





//////////// Routes for the resource /tips /////////////////

router.post('/quizzes/:id(\\d+)/tips', (req, res, next) => {

    const tip = req.body.text;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3004/api/tips/' + req.params.id;
    xhr.open("POST", url, true);
    var data = JSON.stringify({tip});
    console.log(data)
    xhr.send(data);
    res.redirect('/quizzes/' + req.params.id + '/play')

});

router.delete('/tips/:quizId(\\d+)/:id', authenticateJWT, (req, res, next) => {

    fetch('http://localhost:3004/api/tips/'+req.params.quizId)
        .then(res => res.json())
        .then((out) => {
            let xhr = new XMLHttpRequest();
            let url = 'http://localhost:3004/api/tips/' + req.params.quizId;
            xhr.open("DELETE", url, true);
            out[req.params.id] = "";
            var data = JSON.stringify(out);
            xhr.send(data);
            console.log(out)
            res.redirect('/quizzes/'+req.params.quizId+'/play');

        }).catch(err => { throw err });

});


//////////// Routes for the resource /favs /////////////////

router.post('/quizzes/:id(\\d+)/fav', (req, res, next) => {
    
    const fav = 1;

    let xhr = new XMLHttpRequest();
    let url = 'http://localhost:3005/api/fav/' + req.params.id;
    xhr.open("POST", url, true);
    var data = JSON.stringify({fav});
    console.log(data)
    xhr.send(data);
    res.redirect('/quizzes');

});



// router.post('/quizzes/:id(\\d+)/tips/:tipId(\\d+)/delete')




const port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Dynamic Helper: ////PARA USAR LOCALS!!
app.use(function(req, res, next) {

    // console.log('ivan')
    // console.log(user)
    // To use user in the views
    
    fetch('http://localhost:3003/api/login/')
        .then(res => res.json())
        .then((out) => {
            res.locals.user = out[1];
            res.locals.auth = out[0];
            res.locals.id = out[2];
            res.locals.isAdmin = out[3]
    }).catch(err => {throw err});
    

    next();
});


// app.use((req, res, next) => {
//     res.header("Authorization");
//     next();
// })


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());


app.use(router)
app.listen(port);