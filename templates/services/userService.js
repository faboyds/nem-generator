let userRepository = require('../repositories/userRepository');
let roles = require('../config/roles');

exports.getUserByEmail = async function(email) {
    if (email === '') {
        throw new Error('Email can\'t be blank');
    }
    return await userRepository.getUserByEmail(email);
};

exports.getAllUsers = async function() {
    return await userRepository.getAllUsers();
};

exports.getUserById = async function(id) {
    if (id === '') {
        throw new Error('id can\'t be blank');
    }
    return await userRepository.getUserById(id);
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
    return await userRepository.createUser(email, username, hashedPassword, role);
};

exports.deleteUser = async function(user_id) {
    if (user_id === '') {
        throw new Error('User id can\'t be blank');
    }
    return await userRepository.deleteUser(user_id);
};
