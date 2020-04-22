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
// list all the static directories
router.get("/list", async (req, res) => {
    obj = await StaticLocation.findAll({})
    res.json(obj)
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

module.exports = router