const User = require('../models/user');

exports.getUserByEmail = function(email) {
    return User.findOne({
        email: email,
    });
};

exports.getUserById = function(id) {
    return User.findById(id);
};

exports.deleteUser = function(id) {
    return User.deleteById(id);
};

exports.updateUser = function(userId, reqBody) {
    return User.update({
        _id: userId
    }, reqBody,
    {
        new: true
    });
};

exports.updateRole = function(userId, role) {
    return User.update({
        _id: userId
    },{
        role: role
    });
};

exports.createUser = function(email, username, hashedPassword, role) {
    return User.create({
        email: email,
        username: username,
        password: hashedPassword,
        role: role
    });
};

exports.getAllUsers = function() {
    return User.find({});
};
