const express = require('express');
const router = express.Router();
var app = express();
db = require('./tips.json')
var fs = require('fs');
var location = require('location')



router.get('/api/tips', (req, res, next) => {
    res.send(db);
});

router.get('/api/tips/:id(\\d+)', (req, res, next) => {

    fs.readFile('./tips.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        if(obj.tips[req.params.id] === undefined || obj.tips[req.params.id] === null || (obj.tips[req.params.id].tips.tip1 === "" && obj.tips[req.params.id].tips.tip2 === "" && obj.tips[req.params.id].tips.tip3 === "")){
            obj.tips[req.params.id] = {
                "id": req.params.id,
                "tips": {
                    "tip1": "No hay pistas",
                    "tip2": "",
                    "tip3": ""
                }
            }
            json = JSON.stringify(obj);
            console.log(json)
            fs.writeFile('tips.json', json, function(err){
                if (err) throw err;
                    console.log('Tip created');
            });

            res.send(obj.tips[req.params.id].tips);
    
        }else{
            res.send(obj.tips[req.params.id].tips);
        }

    }});
});

router.post('/api/tips/:id(\\d+)', (req, res, next) => {
    req.on("data", (out) => {
        out = JSON.parse(out)
        const tip = out.tip;
        const myQuiz = db.tips[req.params.id];

        // for(var i in myQuiz) {
            fs.readFile('./tips.json', 'utf8', function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    if(!obj.tips[req.params.id].tips.tip1 || obj.tips[req.params.id].tips.tip1 === "No hay pistas") {
                        obj.tips[req.params.id].tips.tip1 = tip;
                        next();
                    } else {
                        if (!obj.tips[req.params.id].tips.tip2) {
                            obj.tips[req.params.id].tips.tip2 = tip;
                            next();
                        } else {
                            obj.tips[req.params.id].tips.tip3 = tip;
                            next();
                        }
                    }

                    json = JSON.stringify(obj);
                    fs.writeFile('tips.json', json, function(err){
                        if (err) throw err;
                            console.log('Tip added');
                    }); 
                }
            });
        // }

        // if(myQuiz.tips.tip1 === "No hay pistas" || myQuiz.tips.tip1 === "") {

        //     fs.readFile('./tips.json', 'utf8', function readFileCallback(err, data){
        //         if (err){
        //             console.log(err);
        //         } else {
        //         obj = JSON.parse(data); //now it an object
        //         obj.tips[req.params.id] = {
        //             "id": req.params.id,
        //             "tips": {
        //                 "tip1": tip,
        //                 "tip2": "",
        //                 "tip3": ""
        //             }
        //         }; //add some data
        //         json = JSON.stringify(obj); //convert it back to json
        //         fs.writeFile('tips.json', json, function(err){
        //             if (err) throw err;
        //             console.log('Tip added');
        //         }); 
        //     }});

        // } else {
        //     if (!myQuiz.tips.tip2 || myQuiz.tips.tip2 === "") {
        //         fs.readFile('./tips.json', 'utf8', function readFileCallback(err, data){
        //             if (err){
        //                 console.log(err);
        //             } else {
        //             obj = JSON.parse(data); //now it an object
        //             obj.tips[req.params.id].tips.tip2 = tip;
        //             json = JSON.stringify(obj); //convert it back to json
        //             fs.writeFile('tips.json', json, function(err){
        //                 if (err) throw err;
        //                 console.log('Tip added');
        //             });

        //         }});

        //     } else {
        //         if(!myQuiz.tips.tip3 || myQuiz.tips.tip3 === "") {
        //             fs.readFile('./tips.json', 'utf8', function readFileCallback(err, data){
        //                 if (err){
        //                     console.log(err);
        //                 } else {
        //                 obj = JSON.parse(data); //now it an object
        //                 obj.tips[req.params.id].tips.tip3 = tip;
        //                 json = JSON.stringify(obj); //convert it back to json
        //                 fs.writeFile('tips.json', json, function(err){
        //                     if (err) throw err;
        //                     console.log('Tip added');
        //                 });
        //             }});
        //         }   
        //     }
        // }
    });
});


router.delete('/api/tips/:id(\\d+)', (req, res, next) => {
    req.on("data", (tip) => {
        tip = JSON.parse(tip);
        // console.log(tip);
        fs.readFile('./tips.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            obj.tips[req.params.id].tips = tip;
            json = JSON.stringify(obj); //convert it back to json
            console.log(json)
            fs.writeFile('tips.json', json, function(err){
                if (err) throw err;
                console.log('Tip added');
            });
        }});
    });
});





const port = 3004;


app.use(router)
app.listen(port);