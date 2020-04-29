
// Definition of the Session model:

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user',
        {
            username: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Username must not be empty"}}
            },
            password: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Password must not be empty"}}
            }
        });
};