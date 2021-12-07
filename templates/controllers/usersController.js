let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let service = require('../services/userService');
let verifyToken = require('./verifyToken');
let authorize = require('./authorizeRole');
let roles = require('../config/roles');


router.get('/', verifyToken, authorize(roles.ADMIN), async function (req, res) {
    try {
        let result = await service.getAllUsers();

        if (!result) return res.status(500).send("No users found.");

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.delete('/', verifyToken, authorize(roles.ADMIN), async function (req, res) {
    try {
        let user = await service.getUserById(req.body.id);
        if (!user) return res.status(404).send("No users found.");

        let result = await service.deleteUser(req.body.id);
        if (!result) return res.status(500).send("There was a problem deleting the user");

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.get('/:userId', verifyToken, authorize([roles.ADMIN, roles.USER]), async function (req, res) {
    try {
        let result = await service.getUserById(req.params.userId);

        if (!result) return res.status(500).send("No user found.");

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.post('/register', async function (req, res) {
    try {

        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        let result = await service.createUser(req.body.email, req.body.username, hashedPassword, roles.USER);

        if (!result) return res.status(500).send("There was a problem registering the user.");

        // create a token
        let token = jwt.sign({id: result.id, role: result.role}, global.gConfig.secret, {
            expiresIn: global.gConfig.tokenLife
        });

        return res.status(200).send({auth: true, token: token});
    } catch (error) {
        // e-mail already in use
        if(error.code === 11000) {
            return res.status(409).json({error: "The e-mail is already in use. Use another one. Error message: " + error.message});
        }
        return res.status(500).json({error: error.message});
    }
});

router.post('/login', async function (req, res) {
    try {
        const user = await service.getUserByEmail(req.body.email);

        if (!user) return res.status(404).send('No user found.');

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) return res.status(401).send({auth: false, token: null});
        let token = jwt.sign({id: user.id, role: user.role}, global.gConfig.secret, {
            expiresIn: global.gConfig.tokenLife
        });

        return res.status(200).send({auth: true, token: token});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

module.exports = router;
