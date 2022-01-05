const jsonfile = require('jsonfile')
const moment = require('moment')
const random = require('random')
const git = require('simple-git')()

require('dotenv').config()

const initialiseRepo = (git) => {
    return git.init()
        .then(() => git.addRemote('origin', process.env.REPO_URL))
}

const makeCommit = (n) => {
    const x = random.int(0, 54)
    const y = random.int(0, 6)
    const DATE = moment()
        .subtract(1, "y")
        .add(1, "d")
        .add(x, "w")
        .add(y, "d")
        .format();
    const data = {
        date: DATE,
    };

    jsonfile.writeFile(process.env.DATA_PATH, data, () => {
        git
            .add([process.env.DATA_PATH])
            .commit(DATE, { '--date': DATE }, makeCommit.bind(this, --n))
            .push(['-u', 'origin', process.env.BRANCH_NAME], () => console.log('Processing => ', DATE, 'DONE'))
    })
}

git
    .addConfig('user.name', process.env.GIT_NAME)
    .addConfig('user.email', process.env.GIT_EMAIL)
    .checkIsRepo()
    .then(isRepo => !isRepo && initialiseRepo(git))
    .then(() => git.fetch())

makeCommit(process.env.LOAD_COMMIT)