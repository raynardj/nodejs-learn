const express = require('express');
const router = express.Router();
const { StaticLocation } = require('../models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const path = require('path')
const fs = require('fs')

// show the detail of a static directory by slug
router.get("/show/:slug", async (req, res) => {
    const obj = await StaticLocation.findOne({ where: { slug: req.params.slug } })
    if (obj) { res.json(obj) }
    else { 
        res.statusCode = 400;
        res.json({ msg: `bad request, no slug ${req.params.slug}` })
    }
})
router.get("/showpage/:slug", async (req,res) =>{
    const obj = await StaticLocation.findOne({ where: { slug: req.params.slug } })
    if (obj) { res.render("show_static.html",{data:obj}) }
    else { 
        res.statusCode = 400;
        res.json({ msg: `bad request, no slug ${req.params.slug}` })
    }
})

// list all the static directories
router.get("/list", async (req, res) => {
    obj = await StaticLocation.findAll({})
    res.json(obj)
})

// list all the static directories
router.get("/listpage", async (req, res) => {
    obj = await StaticLocation.findAll({})
    res.render("static_list.html",{obj})
})

// add a new static directory
router.post("/add", jsonParser, async (req, res) => {
    await StaticLocation.create(req.body)
    res.json({ data: req.body, msg: "Add success" })
})
// delete
router.delete("/delete/:slug", async (req, res) => {
    const obj = await StaticLocation.findOne({ where: { slug: req.params.slug } })
    obj.destroy()
})

router.get("/dir/:slug/*", async (req, res) => {
    obj = await StaticLocation.findOne({ where: { slug: req.params.slug } })
    if (obj) {
        const prepend_len = `/static/dir/${req.params.slug}`.length
        // reconstruct the detailed path
        const detail_path = path.join(obj.root_path, req.originalUrl.substring(prepend_len))

        // check absolute path
        if (!path.isAbsolute(detail_path)) {
            res.statusCode = 400;
            res.json({ msg: `path:${detail_path} not correct` })
        } else {
            fs.exists(detail_path, result => {
                if (result) {
                    fs.readFile(detail_path, 'utf8', (err, data) => {
                        if (err) {
                            // if we can not read that file, it might be a directory
                            fs.readdir(detail_path, (err, data) => {
                                if (err) {
                                    // if still error
                                    res.json({ msg: `can not read file ${detail_path}` })
                                }
                                // list dir files
                                res.json({ dir: data, pwd: detail_path, })
                            })
                        } else {
                            // return the file content string
                            res.json({ file: data, path: detail_path })
                        }
                    })
                }
                else {
                    res.statusCode = 400;
                    res.json({ msg: `path:${detail_path} not found` });
                }
            })
        }
    }
    else {
        res.statusCode = 400;
        res.json({ msg: `bad request, no slug ${req.params.slug}` })
    }
})

function calc_path(req,pagetype,root_path){
    const prepend_len = `/static/${pagetype}/${req.params.slug}`.length
        // reconstruct the detailed path
        const tail_path = req.originalUrl.substring(prepend_len);
        const detail_path = path.join(root_path,tail_path );
        return {tail_path,detail_path,prepend_len};
}
// return raw file content
router.get("/dirraw/:slug/*", async (req,res) => {
    obj = await StaticLocation.findOne({ where: { slug: req.params.slug } })
    if (obj) {
        const {tail_path,detail_path,prepend_len} = calc_path(req,"dirraw",obj.root_path)
        fs.exists(detail_path,result =>{
            if(result){
                fs.readFile(detail_path,"utf8",(err,data) =>{
                    if (err) res.json({ msg: `can not read path:${detail_path}` });
                    else {
                        res.send(data)
                    }
                })
            }
            else{
                res.json({ msg: `path:${detail_path} not found` });
            }
        })
    }
})

router.get("/dirpage/:slug/*", async (req, res) => {
    obj = await StaticLocation.findOne({ where: { slug: req.params.slug } })
    if (obj) {
        const {tail_path,detail_path,prepend_len} = calc_path(req,"dirpage",obj.root_path)

        // check absolute path
        if (!path.isAbsolute(detail_path)) {
            res.statusCode = 400;
            res.json({ msg: `path:${detail_path} not correct` })
        } else {
            fs.exists(detail_path, result => {
                if (result) {
                    fs.readFile(detail_path, 'utf8', (err, data) => {
                        if (err) {
                            // if we can not read that file, it might be a directory
                            fs.readdir(detail_path, (err, data) => {
                                if (err) {
                                    // if still error
                                    res.json({ msg: `can not read file ${detail_path}` })
                                }
                                // list dir files
                                const path = tail_path.slice(-1,)=="/"?tail_path.slice(0,-1):tail_path
                                res.render("dirpage.html",{data:data,path:path,slug:req.params.slug})
                            })
                        } else {
                            // return the file content string
                            if(req.params.format == "raw") res.send(data)
                            else{
                            // return a page contains content
                            const parent_path = tail_path.slice(0,Math.max(tail_path.lastIndexOf("/"),0)+1)
                            res.render("content.html",{data:data,path:parent_path,slug:req.params.slug, full_path: tail_path})
                            }
                        }
                    })
                }
                else {
                    res.statusCode = 400;
                    res.json({ msg: `path:${detail_path} not found` });
                }
            })
        }
    }
    else {
        res.statusCode = 400;
        res.json({ msg: `bad request, no slug ${req.params.slug}` })
    }
})

module.exports = router