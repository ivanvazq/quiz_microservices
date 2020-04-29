const express = require('express');
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var path = require('path');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Sequelize = require("sequelize");
const options = {logging: false, operatorsAliases: false};
const sequelize = new Sequelize("sqlite:user.sqlite", options);


var userLog = [];

app.use(bodyParser.json());

// Base de datos Users
const user = sequelize.define(  // define Quiz model (table quizzes)
    'user',
    {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        isAdmin: Sequelize.BOOLEAN
    }
);
sequelize.sync() // Syncronize DB and seed if needed
    .then(() => user.count())
    .then(count => {
        if (count === 0) {
            return user.bulkCreate([
                {username: "admin", password: "1234", isAdmin: true},
                {username: "pepe", password: "5678", isAdmin: false}
            ])
                .then(c => console.log(`DB filled with ${c.length} users.`));
        } else {
            console.log(`DB exists & has ${count} users.`);
        }
    })
    .catch(console.log);


router.get('/api/users', (req, res, next) => {


    user.findAll()
    .then(users => {
        if(users) {
            res.send({users});
        } else {
            throw new Error('There is no user with id=' + req.params.id);
        }
    })
    .catch(error => next(error));
});

router.get('/api/users/:id(\\d+)', (req, res, next) => {
    user.findByPk(req.params.id)
    .then(user => {
        res.send({user});
    })
    .catch(error => next(error));
})




const accessTokenSecret = 'youraccesstokensecret';


router.post('/api/login', (req, res, next) => {
    req.on("data", (login) => {
        login = JSON.parse(login)

        const username = login.username;
        const password = login.password;
        
        user.findOne({where: {username: username, password: password}})
        .then(user => {

            if (user) {
                const accessToken = jwt.sign({ username: user.username}, accessTokenSecret, { expiresIn: '20m' });
                // res.send({accessToken})
                // .cookie('access_token', 'Bearer ' + accessToken)
                // .redirect("http://localhost:3000/")
                // console.log(req.cookie)

                userLog[0] = accessToken;
                userLog[1] = user.username;
                userLog[2] = user.id;
                userLog[3] = user.isAdmin;


            } else {
                userLog[0] = 'badPass';
                userLog[1] = '';
                res.send('Username or password incorrect');
            }
        });

    });
});

router.get('/api/session', (req, res, next) => {
    res.send("USER")
    
    
    // req.on("data", (data) => {
    //     data = JSON.parse(data)
    //     console.log('user')
    //     res.send(data)
    // })
})

router.get('/api/login', (req, res, next) => {
    
    // console.log(userLog)
    res.send(userLog)
    
})

router.post('/api/logout', (req, res) => {
    req.on("data", (logout) => {

        logout = JSON.parse(logout);
        console.log(logout)
        userLog= [];
        res.send("Logout successful");
    })
});


//Update user

router.put('/api/users/:id(\\d+)', (req, res, next) => {
    
    req.on("data", (userUp) => {

        userUp = JSON.parse(userUp);
        console.log(userUp)

        let updateValues = { password: userUp.password };
            user.update(updateValues, { where: { id: req.params.id } }).then(() => {
                console.log('Changed');
        });
        
    });
});


// GET /users/new
router.get('/api/users/new', (req, res, next) => {

    const user = {
        username: "",
        password: ""
    };

    res.send({user});
});


// POST /users/create
router.post('/api/users', (req, res, next) => {

    req.on("data", (userN) => {
        userN = JSON.parse(userN)

        const username = userN.username;
        const password = userN.password;
        const isAdmin = false;

        const newUser = user.build({
            username,
            password,
            isAdmin
        })
        newUser.save({fields: ["username", "password", "isAdmin"]})
        .then(user => {
//        req.flash('success', 'Quiz created successfully.');
            let xhr = new XMLHttpRequest();
            let url = 'http://localhost:3005/api/fav/new';
            xhr.open("POST", url, true);
            var data = JSON.stringify(newUser.username);
            console.log(data)
            xhr.send(data);
            res.redirect('/api/users/');
        })
        .catch(Sequelize.ValidationError, error => {
//        req.flash('error', 'There are errors in the form:');
//        error.errors.forEach(({message}) => req.flash('error', message));
            res.send({quiz});
        })
        .catch(error => {
//        req.flash('error', 'Error creating a new Quiz: ' + error.message);
            next(error);
        });
    });
});



const port = 3003;

app.use(router)
app.listen(port, () => {
    console.log('Authentication service started on port ' + port);
});

