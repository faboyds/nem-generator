let jwt = require('jsonwebtoken');
let userController = require('../services/userService');

function verifyToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }

    jwt.verify(token, global.gConfig.secret, async function (err, decoded) {
        if (err)
            return res.status(403).send({
                auth: false,
                validToken: false,
                message: 'Failed to authenticate token (token is invalid).'
            });

        let result = await userController.getUserById(decoded.id);
        if(!result) return res.status(401).send({ auth: false, message: 'The token you used does not correspond to a valid user.' });

        // if everything good, save to request for use in other controllers
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
}

module.exports = verifyToken;
