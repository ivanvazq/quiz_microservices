
// Definition of the Quiz model:

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('quiz',
        {
            question: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Question must not be empty"}}
            },
            answer: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Answer must not be empty"}}
            },
            author: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Author must not be empty"}}
            }
        });
};
