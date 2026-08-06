const {logfunc, log} = require('./logger')
const path = require('path')
const fspromises = require('fs/promises')
const fs = require('fs')
const {format} = require('date-fns')
const {v4:uuid} = require('uuid')


const errhandle  = async (err,res,req,next) =>{
    if(err){
        req.status(500)
        log(err, 'errlog.txt')
        next()
    } else{
        next()
    }
}

module.exports = errhandle