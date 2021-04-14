const fs = require('fs')
const chalk = require('chalk')
const _ = require('lodash')
const { forEach } = require('lodash')

module.exports = {
  createProjectList,
  createProject,
  alterTimeOfProject,
  generateProjectList
}

function createProjectList (opts) {
  const { n: listName, F: forceCreate } = opts

  if (projectListExist(listName) && !forceCreate) {
    console.log(`\nA project list with the same name already exists. Use \n${chalk.green(`ptm add-list -n=${listName} -F`)} \nIf you wish to overwrite\n`)
    return
  }

  updateProjectList(listName, [])
  console.log(`\nnew project list ${chalk.green(opts.name)} has been created\n`)
}

function createProject (opts) {
  const { n: projectName, L: listName } = opts

  if (!projectListExist(listName)) {
    logListNotExists(listName)
    return
  }

  const projectList = fetchProjectListJson(listName)
  projectList.push({
    title: projectName,
    total_time_spent: 0
  })

  updateProjectList(listName, projectList)
}

function alterTimeOfProject (opts) {
  const { p: projectName, L: listName, m: minutes } = opts

  const minuteInMilliseconds = 60 * 1000

  if (!projectListExist(listName)) {
    logListNotExists(listName)
    return
  }

  const projectList = fetchProjectListJson(listName)

  const project = _.find(projectList, { title: projectName })
  if (!project) {
    console.log(chalk.red(`\nthe project with name ${projectName} does not exist\n`))
    return
  }

  if (project.total_time_spent === 0 && minutes < 0) {
    console.log(chalk.yellow(`\ntotal-time-spent of project ${projectName} is at 0 min\n`))
    return
  }

  project.total_time_spent += (minutes * minuteInMilliseconds)

  updateProjectList(listName, projectList)

  console.log(chalk.green(`${minutes} minutes added to ${projectName} project`))
}

function generateProjectList (opts) {
  const { L: listName } = opts
  const hourInMilliseconds = 60 * 60 * 1000

  if (!projectListExist(listName)) {
    logListNotExists(listName)
  }

  const projectList = fetchProjectListJson(listName)

  forEach(projectList, (project) => {
    const hoursSpendOnProject = Math.ceil(project.total_time_spent / hourInMilliseconds)
    console.log(chalk.blue(`${project.title}: ${hoursSpendOnProject} hours`))
  })
}

function projectListExist (listName) {
  const path = `projects/${listName}.json`
  return fs.existsSync(path)
}

function logListNotExists (listName) {
  console.log(chalk.red(`\nthe list with name ${listName} does not exist\n`))
}

function fetchProjectListJson (listName) {
  const path = `projects/${listName}.json`

  const projectListData = fs.readFileSync(path)
  return JSON.parse(projectListData)
}

function updateProjectList (listName, data) {
  const path = `projects/${listName}.json`

  if (!fs.existsSync('projects')) fs.mkdirSync('projects')
  fs.writeFileSync(path, JSON.stringify(data))

  console.log(chalk.green('project list has been updated'))
}
