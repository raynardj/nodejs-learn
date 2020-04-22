const http  = require("http");

// libraries
const express = require('express');
const nunjucks = require('nunjucks');

// models
const {sequelize,DBs,SqlApi} = require("./models");

// views
const db_router = require('./views/db');
const static_router = require('./views/static');

const hostname  = "0.0.0.0";
const port = 3000;
const app = express();

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.use("/db",db_router)
app.use("/static",static_router)

app.get("/", (req,res)=>{
    console.log("Loading main page");
    res.render("index.html");
})

app.get("/api/:slug",async (req,res)=>{
    const {slug} = req.params;
    const api_obj = await SqlApi.findOne({where:{slug:slug}});

    var msg = "";
    if(api_obj == null){
        msg = `${slug} Not Found`;
    }else{
        msg = `Running the sql line:\t${api_obj.sql}`;
        res.send(msg);
    }
})

app.listen(port,()=> console.log(`App running on port ${port}`))
