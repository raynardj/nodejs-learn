const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {DBs} = require("../models")

router.get('/show/:id',async(req,res)=>{
    const db = await DBs.findOne({where:{id:req.params.id}})
    res.json(db)
})
router.get('/list',(req,res)=>{
    DBs.findAll({where:{}})
        .then(dbs=> res.json(dbs))
})
var jsonParser = bodyParser.json()
router.post('/add',jsonParser,(req,res)=>{
    console.log(req.body);
    DBs.create(req.body)
    res.json(req.body);
})
module.exports = router