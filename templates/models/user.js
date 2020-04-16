const mongoose = require('mongoose');
const roles = require('../config/roles');
const mongoose_delete = require('mongoose-delete');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, default: roles.USER},
},
{
    timestamps: { createdAt: true, updatedAt: true }
});

userSchema.plugin(mongoose_delete,  { deletedAt : true, overrideMethods: 'all' });

const User = mongoose.model('User', userSchema);

module.exports = User;
