const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {
    SqlApi,DBs
} = require("../models")

router.get('/show/:id', async (req, res) => {
    const api = await SqlApi.findOne({
        where: {
            id: req.params.id
        }
    })
    res.json(api)
})
router.get('/list', (req, res) => {
    SqlApi.findAll({
            where: {}
        })
        .then(apis => res.json(apis))
})

router.get("/viewapi/:slug",async(req,res)=>{
    const slug = req.params.slug;
    const api = await SqlApi.findOne({where:{slug}});
    res.json(api)
})

router.get("/view/:slug",async(req,res)=>{
    const slug = req.params.slug;
    SqlApi.findOne({where:{slug}})
        .then((result)=>{
            let api = result.get()
            return api
        })
        .catch((err)=>{
            res.statusCode = 400
            res.json({error:`api name ${slug} not found`})
        })
        .then((api)=>{
            DBs.findOne({where:{id:api.db_id}})
            .then((db)=>{
                res.render("api_view.html",{api,db})
            })
            .catch((err)=>{
                res.statusCode = 400;
                res.json({error:`Database ${api.db_id} not found`})
            })
        })
    
})

router.get("/listpage", async(req, res) => {
    const {
        slug,
        db_id,
        sql,
        is_temp,
        md_doc
    } = req.query;
    if (slug && sql && db_id) {
        console.log(`Creating db connection ${slug} ${sql} ${db_id}`);
        SqlApi.create({
            slug,
            db_id,
            sql,
            is_temp,
            md_doc
        });
    }
    let [apis, dbs] = await Promise.all([
        SqlApi.findAll({}),
        DBs.findAll({}),]);
    
    res.render("api_list.html", {
        apis,
        dbs
    });
})

router.get("/delete/:id", async (req, res) => {
    const obj = await DBs.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    })
    obj.destroy()
    res.redirect("/sqlapi/listpage")
})

var jsonParser = bodyParser.json()
router.post('/add', jsonParser, (req, res) => {
    console.log(req.body);
    SqlApi.create(req.body);
    res.json(req.body);
})
module.exports = router