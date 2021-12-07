# Node.js - Express - MongoDB Generator

[![npm version](https://badge.fury.io/js/nem-generator.svg)](https://badge.fury.io/js/nem-generator)
[![github stars](https://img.shields.io/github/stars/faboyds/nem-generator?style=social)](https://img.shields.io/github/stars/faboyds/nem-generator?style=social)

A Node.js project generator using Express and connected to MongoBD.

## Installation

    npm install -g nem-generator

## Features

- [x] Authentication middleware (with JWT)
- [x] Authorization middleware (role-based access control)
- [x] Connection to MongoDB (using Mongoose)
- [x] Example for User model (schema, service, controller, router)
- [x] Config file prepared for 3 environments (dev, test, prod)

## Documentation

### How to use

Simply run 
 
    nem-gen
      
and you will be prompted with questions, allowing you to configure your project (for now, the project name is the only configurable parameter during project creation).

### Project Structure

This project follows a ``Model - Repository - Service - Controller`` structure. This implementation is inspired by this [StackOverflow answer](https://stackoverflow.com/a/42164174/10326191) (although it uses another terminology for the component names).     
The generated project has the following files:

```bash
    .
    ├── app.js
    ├── bin
    │   └── www
    ├── config
    │   ├── config.js
    │   ├── config.json
    │   ├── mongod.conf
    │   └── roles.js
    ├── controllers
    │   ├── authorizeRole.js
    │   ├── usersController.js
    │   └── verifyToken.js
    ├── models
    │   └── user.js
    ├── package.json
    ├── repositories
    │   └── userRepository.js
    └── services
        └── userService.js
```


### Config File

In config/config.json you can configure global variables to use in your project.    

| Parameter | Description                                                                                                             | Default values                                                                                     | Required |
|-----------|-------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|----------|
| config_id | Environment name                                                                                                        | ["development","testing","production"] <br>for the corresponding environment                       | false    |
| app_name  | Project name                                                                                                            | name inserted in project creation                                                                  | false    |
| node_port | Port where the project will run                                                                                         | 5000 (if no value exist in the config) <br>or [3000, 3000, 3001] for the corresponding environment | false    |
| database  | URL to a MongoDB database                                                                                               | "mongodb://127.0.0.1/{project-name}-{environment}"                                                 | true     |
| secret    | Secret for the JWT. Make sure you change this to secure your tokens                                                     | "supersecret"                                                                                      | true     |
| tokenLife | Duration of the token expressed in seconds or<br> a string describing a time span [zeit/ms](https://github.com/zeit/ms) | 2678400 (31 days)                                                                                  | true     |

Make sure you always have the required fields at least in "development", since the default project structure uses these.
You can only repeat config variables in other environments if you want to override the default config variable values found in the default "development" environment.

Generated default file:

```
{
    "development": {
        "config_id": "development",
        "app_name": "project-name",
        "node_port": 3000,
        "database": "mongodb://127.0.0.1/project-name-dev",
        "secret": "supersecret",
        "tokenLife": 2678400
    },
    "testing": {
        "config_id": "testing",
        "node_port": 3000,
        "database": "mongodb://127.0.0.1/project-name-test"
    },
    "production": {
        "config_id": "production",
        "node_port": 3001,
        "database": "mongodb://127.0.0.1/project-name-prod"
    }
}
```

You can add your own config parameters in this file, and use them in your code with ``global.gConfig.{parameter-name}``, e.g. ``global.gConfig.database``.


### Authentication and Authorization

Make sure ``verifyToken`` middleware is always called before ``authorize``, in order to extract the role of the received token.    
Here is an example:

```
router.get('/', verifyToken, authorize(roles.ADMIN), async function (req, res){
    ...
}
```

This function is only authorized for tokens from users with 'Admin' role. 
You can also authorize multiple roles by passing an array to the ``authorize``, p.e.

```
authorize([roles.USER, roles.ADMIN])
```

#### Remove restrictions

If you don't want any role restriction, just remove the `authorize` middleware.

You can also remove the token restriction, remove the `verifyToken` middleware.

## TODO

- [ ] Allow selection of database type (add support to SQL using Sequelize)
- [ ] Allow roles configuration during project creation
- [ ] Add optional client app template (for React, Angular or Vue)

Feel free to create issues with more ideas!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
