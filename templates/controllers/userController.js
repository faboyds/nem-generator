let userService = require('../services/userService');
let roles = require('../config/roles');

exports.getUserByEmail = async function(email) {
    if (email === '') {
        throw new Error('Email can\'t be blank');
    }
    return await userService.getUserByEmail(email);
};

exports.getAllUsers = async function() {
    return await userService.getAllUsers();
};

exports.getUserById = async function(id) {
    if (id === '') {
        throw new Error('id can\'t be blank');
    }
    return await userService.getUserById(id);
};

exports.createUser = async function(email, username, hashedPassword, role) {
    if (email === '') {
        throw new Error('Email can\'t be blank');
    }
    if (username === '') {
        throw new Error('Username can\'t be blank');
    }
    if (hashedPassword === '') {
        throw new Error('Password can\'t be blank');
    }
    if (role === '') {
        role = roles.USER;
    }
    return await userService.createUser(email, username, hashedPassword, role);
};

exports.deleteUser = async function(user_id) {
    if (user_id === '') {
        throw new Error('User id can\'t be blank');
    }
    return await userService.deleteUser(user_id);
};
