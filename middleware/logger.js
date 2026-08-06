const path = require('path')
const fspromises = require('fs/promises')
const fs = require('fs')
const {format} = require('date-fns')
const {v4:uuid} = require('uuid')

const log = async (msg, pather) =>{
    const date = format(new Date, "hh:mm:ss  dd/MM/yyyy")
    const item = `${date}\t${uuid()}\t${msg}\n`

    const exists = fs.existsSync(path.join(__dirname, '..', 'logs'))

    if(!exists){
        await fspromises.mkdir(path.join(__dirname, '..' ,'logs'))
        
    }
    await fspromises.appendFile(path.join(__dirname, '..','logs', pather), item)
}

const logfunc = async (req, res, next) =>{
    log(`origin: ${req.headers.origin}\t${req.method}: ${req.url}`,'reqlog.txt')
    next()
}

module.exports = {logfunc, log}