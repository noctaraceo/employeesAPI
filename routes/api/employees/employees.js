const express = require('express')

const path = require('path')
const fspromises = require('fs/promises')
const router = express.Router()

const datas = {}

datas.employees = require('./../../../data/employees.json')

router.route('/')
    .get((req,res) =>{
        res.send(datas.employees)
    })
    .post(async (req,res) =>{
        let maxid ;
        if(datas.employees[0]){
            maxid = datas.employees.reduce((acc,next)=>{
                if(acc['id'] > next['id']){
                    return acc
                } else{
                    return next
                }
            })
            maxid = maxid['id']
        } else{
            maxid = 0
        }
        let truemaxid = maxid['id'] < 1 ? 1 : maxid +1
        const newguy = {"id": truemaxid,"name" : req.body.name, "sector" : req.body.sector}
        datas.employees.push(newguy)
        const stringed = JSON.stringify(datas.employees, null, 2)
        await fspromises.writeFile(path.join(__dirname, '..', '..','..','data','employees.json'),stringed)
        res.send({"message" : "employee added", "employee" : newguy})
    })
    .put(async (req,res) =>{
        const employee = datas.employees.find(emp => emp.id == req.body.id)
        
        if (!employee) {
            return res.status(404).json({"message": "404 not found"})
        }
        
       
        if(req.body.name){
            employee.name = req.body.name
        } else{
            employee.name = employee.name
        }
        if(req.body.sector){
            employee.sector = req.body.sector
        } else{
            employee.sector = employee.sector
        }
        
        await fspromises.writeFile(path.join(__dirname, '..', '..', '..', 'data', 'employees.json'), JSON.stringify(datas.employees, null, 2))
        return res.json({"message": "successfully changed", "emp": employee})
    })
    .delete(async (req, res) =>{
        const employee = datas.employees.find(emp => emp.id == req.body.id)
        if(!employee){
            res.status(404)
            res.send({'message' : "404 not found"})
            return;
        }
        datas.employees.splice(datas.employees.indexOf(employee), 1)
        await fspromises.writeFile(path.join(__dirname, '..', '..', '..', 'data', 'employees.json'), JSON.stringify(datas.employees, null, 2))
        res.send({"message" : "emplyoee removed", "employee" : employee})
    })
    

router.route('/:id')
    .get((req,res) =>{
        for(const i of datas.employees){
            if(i['id'] == req.params.id){
                res.send({"name" : i['name'], "id" : i['id'], "sector" : i['sector']})
                return;
            }
        }
        res.status(404)
        res.send({"message":"404 not found"})
    })
    


module.exports = router