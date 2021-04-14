#! /usr/bin/env Node
const yargs = require('yargs')
const {
  createProjectList,
  createProject,
  alterTimeOfProject,
  generateProjectList
} = require('./utils')

yargs
  .command(
    'add-list',
    'Add a new project list',
    {
      name: {
        alias: 'n',
        describe: 'Specify a title for your project list',
        demandOption: true
      },
      force: {
        alias: 'F',
        describe: 'Force create project list overwriting the old one'
      }
    },
    createProjectList
  )
  .command(
    'add-project',
    'Add a new project to your project list',
    {
      name: {
        alias: 'n',
        describe: 'Specify a name for your project',
        demandOption: true
      },
      list: {
        alias: 'L',
        describe: 'Specify the list name where to add the project',
        demandOption: true
      }
    },
    createProject
  )
  .command(
    'alter-time',
    'Alter the time of your project total-time-spent',
    {
      project: {
        alias: 'p',
        describe: 'Specify the name of your project',
        demandOption: true
      },
      list: {
        alias: 'L',
        describe: 'Specify the list name of the project',
        demandOption: true
      },
      minutes: {
        alias: 'm',
        describe: 'Specify the amount of minutes to add',
        demandOption: true
      }
    },
    alterTimeOfProject
  )
  .command(
    'get-data',
    'Get the data of your project list',
    {
      list: {
        alias: 'L',
        describe: 'Specify the list name of the project',
        demandOption: true
      }
    },
    generateProjectList
  )
  .help()
  .demandCommand(1, 'You need one command before moving on')
  .parse()
