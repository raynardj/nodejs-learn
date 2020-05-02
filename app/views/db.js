const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {
    DBs
} = require("../models")

router.get('/show/:id', async (req, res) => {
    const db = await DBs.findOne({
        where: {
            id: req.params.id
        }
    })
    res.json(db)
})
router.get('/list', (req, res) => {
    DBs.findAll({
            where: {}
        })
        .then(dbs => res.json(dbs))
})

router.get("/listpage", async (req, res) => {
    const {
        name,
        database,
        dialect,
        username,
        password,
        md_doc,
        host,
        port
    } = req.query
    if (name && database&&dialect)
    {
        console.log(`Creating db connection ${name} ${dialect} ${database}`)
        DBs.create({
            name,database,dialect,username,password,md_doc,host,port
        })
    }
    const dbs = await DBs.findAll({})

    res.render("db_list.html", {
        dbs
    })
})

router.get("/delete/:id", async (req, res) => {
    const obj = await DBs.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    })
    obj.destroy()
    res.redirect("/db/listpage")
})

var jsonParser = bodyParser.json()
router.post('/add', jsonParser, (req, res) => {
    if(req.body.name==null){
        res.statusCode = 400;
        res.json({msg:`No name set`});
    }
    console.log("Adding new database>>")
    console.log(req.body);
    DBs.create(req.body);
    res.json(req.body);
})
module.exports = router