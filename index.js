#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const chalk = require('chalk');

const CURR_DIR = process.cwd();

const QUESTIONS = [
    {
        name: 'project-name',
        type: 'input',
        message: 'Project name:',
        validate: function (input) {
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            else return 'Project name may only include letters, numbers, underscores and hashes.';
        }
    }
];

inquirer.prompt(QUESTIONS)
    .then(answers => {
        const projectName = answers['project-name'];
        const templatePath = `${__dirname}/templates`;

        fs.mkdirSync(`${CURR_DIR}/${projectName}`);

        console.log('\nCreating project in ' +  chalk.yellow(`${CURR_DIR}/${projectName}`));

        createDirectoryContents(templatePath, projectName, projectName);

        console.log(`\nProject '${projectName}' created! You can start working 🎉\n`);

        console.log(chalk.cyan('    - npm start'));
        console.log('       Starts the app.');

        console.log(chalk.cyan('    - npm run dev'));
        console.log('       Starts the app with nodemon (automatically restarts the node application when file changes in the directory are detected)');

        console.log(chalk.cyan('    - npm run db'));
        console.log('       Starts MongoDB (check configs in config/mongod.conf)');
    });

function createDirectoryContents (templatePath, newProjectPath, newProjectName) {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach(file => {
        const origFilePath = `${templatePath}/${file}`;

        // get stats about the current file
        const stats = fs.statSync(origFilePath);

        if (stats.isFile()) {
            let contents = fs.readFileSync(origFilePath, 'utf8');

            // Rename
            if (file === '.npmignore') file = '.gitignore';

            contents = contents.replace(/project-name/g, newProjectName);

            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

            // recursive call
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`, newProjectName);
        }
    });
}
