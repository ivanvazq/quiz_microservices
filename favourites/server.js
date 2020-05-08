const express = require('express');
const router = express.Router();
var app = express();
db = require('./fav.json')
var fs = require('fs');
var location = require('location')
const fetch = require('node-fetch');

// var sessionService = "localhost:3003";
var sessionService = "session:3003";

router.get('/api/fav', (req, res, next) => {
    fs.readFile('./fav.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            res.send(obj);
        }
    });
});

router.get('/api/fav/:id(\\d+)', (req, res, next) => {

    fetch("http://" + sessionService +"/api/login")
    .then(res => res.json())
    .then(userLog => {
        userLog = userLog[1];

        fs.readFile('./fav.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data);
            
            if(obj.favs.userLog.fav[req.params.id-1] === undefined || obj.favs.userLog[req.params.id-1] === null){
                db.favs.userLog.fav[req.params.id-1] = [false];
                res.send(db.favs.userLog.fav[req.params.id-1].fav)
        
            }else{
                res.send(obj.favs[req.params.id-1].fav);
            }
        }});
    });
});

router.post('/api/fav/:id(\\d+)', (req, res, next) => {
    req.on("data", (out) => {
        out = JSON.parse(out)
        const fav = out.fav;
        // var state = db.favs[req.params.id].fav;

        fetch("http://" + sessionService +"/api/login")
        .then(res => res.json())
        .then(userLog => {
            userLog = userLog[1];

            fs.readFile('./fav.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    obj = JSON.parse(data); //now it an object
                    for (var i in obj.favs) {
                        if(obj.favs[i].user === userLog) {
                            obj.favs[i].fav[req.params.id-1] = !obj.favs[i].fav[req.params.id-1];
                            console.log(obj.favs[i].fav[req.params.id-1])
                        }
                    }               
                    json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile('fav.json', json, function(err){
                        if (err) throw err;
                        console.log('Fav changed');
                        // console.log(state)
                    }); 
            }});
        });
    });
});

router.post('/api/fav/new', (req, res, next) => {
    req.on("data", (out) => {
        console.log(out)
        fs.readFile('./fav.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object
                out = JSON.parse(out);

                var size = Object.keys(obj.favs).length
                obj.favs[size] = {
                    "user": out,
                    "fav": [false]
                }
                json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile('fav.json', json, function(err){
                        if (err) throw err;
                        console.log('Fav changed');
                        // console.log(state)
                });
                
            }
        })
    })
})





const port = 3005;


app.use(router)
app.listen(port);