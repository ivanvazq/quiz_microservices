const Sequelize = require("sequelize");
const options = {logging: false, operatorsAliases: false};
const sequelize = new Sequelize("sqlite:quiz.sqlite", options);

//const {models} = require("../models");


const user = sequelize.define(  // define Quiz model (table quizzes)
    'user',
    {
        username: Sequelize.STRING,
        password: Sequelize.STRING
    }
);

sequelize.sync() // Syncronize DB and seed if needed
    .then(() => user.count())
    .then(count => {
        if (count === 0) {
            return quiz.bulkCreate([
                {username: "admin", password: "Rome"},
                {username: "pepe", password: "Paris"}
            ])
                .then(c => console.log(`DB filled with ${c.length} users.`));
        } else {
            console.log(`DB exists & has ${count} users.`);
        }
    })
    .catch(console.log);