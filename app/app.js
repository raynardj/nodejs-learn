const http  = require("http");

const {sequelize,DBs,SqlApi} = require("./models");

const express = require('express')
const app = express()

const hostname  = "0.0.0.0";
const port = 3000;

app.get("/", (req,res)=>{
    console.log("Loading main page");
    res.send("Hello Pretty");
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
