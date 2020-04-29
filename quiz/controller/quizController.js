const Sequelize = require("sequelize");
const options = {logging: false, operatorsAliases: false};
const sequelize = new Sequelize("sqlite:quiz.sqlite", options);

//const {models} = require("../models");
const quizModel = sequelize.import('../model/quizModel');


const quiz = sequelize.define(  // define Quiz model (table quizzes)
    'quiz',
    {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        author: Sequelize.STRING
    }
);

sequelize.sync() // Syncronize DB and seed if needed
    .then(() => quiz.count())
    .then(count => {
        if (count === 0) {
            return quiz.bulkCreate([
                {question: "Capital of Italy", answer: "Rome", author: "admin"},
                {question: "Capital of France", answer: "Paris", author: "admin"},
                {question: "Capital of Spain", answer: "Madrid", author: "pepe"},
                {question: "Capital of Portugal", answer: "Lisbon", author: "admin"}
            ])
                .then(c => console.log(`DB filled with ${c.length} quizzes.`));
        } else {
            console.log(`DB exists & has ${count} quizzes.`);
        }
    })
    .catch(console.log);

    // Autoload el quiz asociado a :quizId
exports.load = (req, res, next, quizId) => {

    quiz.findByPk(quizId)
    .then(quiz => {
        if (quiz) {
            req.quiz = quiz;
            next();
        } else {
            throw new Error('There is no quiz with id=' + quizId);
        }
    })
    .catch(error => next(error));
};


// GET /quizzes
exports.index = (req, res, next) => {

    quiz.findAll()
    .then(quizzes => {
        res.send({quizzes});
    })
    .catch(error => next(error));
};

// GET /quizzes/:quizId
exports.show = (req, res, next) => {

    const {quiz} = req;

    res.send({quiz});
};


// GET /quizzes/new
exports.new = (req, res, next) => {

    const quiz = {
        question: "",
        answer: ""
    };

    res.send({quiz});
};


// POST /quizzes/create
exports.create = (req, res, next) => {

    req.on("data", (quiz) => {
        quiz = JSON.parse(quiz)

        const question = quiz.question;
        const answer = quiz.answer;
        const author = quiz.author;

        const newQuiz = quizModel.build({
            question,
            answer,
            author
        })
        console.log(newQuiz)
        newQuiz.save({fields: ["question", "answer", "author"]})
        .then(quiz => {
//        req.flash('success', 'Quiz created successfully.');
            res.redirect('/quizzes/' + quiz.id);
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
};


// // GET /quizzes/:quizId/edit
// exports.edit = (req, res, next) => {

//     const {quiz} = req;

//     res.send({quiz});
// };

//UPDATE un quiz editado
 exports.update = (req, res, next) => {

    req.on("data", (quizUp) => {

        quizUp = JSON.parse(quizUp);

        let updateValues = { question: quizUp.question, answer: quizUp.answer };
            quizModel.update(updateValues, { where: { id: req.params.quizId } }).then(() => {
                console.log('Changed');
        });
        
    })
 };


// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {

    // req.on("data", (quiz) => {

        req.quiz.destroy()
            .then(() => {
        //        req.flash('success', 'Quiz deleted successfully.');
                res.redirect('/quizzes');
            })
            .catch(error => {
        //        req.flash('error', 'Error deleting the Quiz: ' + error.message);
                next(error);
            });
        // })

//     req.quiz.destroy()
//     .then(() => {
// //        req.flash('success', 'Quiz deleted successfully.');
//         res.redirect('/quizzes');
//     })
//     .catch(error => {
// //        req.flash('error', 'Error deleting the Quiz: ' + error.message);
//         next(error);
//     });
};

// GET /quizzes/:quizId/play
exports.play = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || '';

    res.send({
        quiz,
        answer
    });
};


// GET /quizzes/:quizId/check
exports.check = (req, res, next) => {

    const {quiz, query} = req;

    const answer = query.answer || "";
    const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

    res.send({
        quiz,
        result,
        answer
    });
};





