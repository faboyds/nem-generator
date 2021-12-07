function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.role)) {
                // user's role is not authorized
                return res.status(403).json({validToken: true, message: 'Forbidden. You don\'t have the permission to access this content.' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

module.exports = authorize;
