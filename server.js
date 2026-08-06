const express = require('express')
const {logfunc, log} = require('./middleware/logger')
const errhandle = require('./middleware/errhandler')
const path = require('path')
const cors = require('cors')
const whitelisted = ['http://127.0.0.1:5500','http://localhost:3500']
const corsopt = {
    origin : (origin, callback) =>{
        console.log(origin)
        if(whitelisted.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        } else{
            callback(new Error("unallowed"))
        }
    },
    optionsSuccessStatus : 200
}

const server = express()
server.use(logfunc)
const PORT = process.env.PORT || 5000
server.use(cors(corsopt))
server.use(express.json())

server.use('/api/employees', require('./routes/api/employees/employees'))
//server.use('/api/students', require('./routes/api/students/users'))



server.use((req,res) =>{
    req.status(404)

    res.send({"message" : "404 not found"})
})
server.use(errhandle)
server.listen(PORT, () =>{
    console.log('server running at port' + PORT)
})