const http  = require("http");

const {sequelize,DBs,SqlApi} = require("./models");


const hostname  = "0.0.0.0";
const port = 3000;

const server = http.createServer(async (req,res)=>{
    const now = new Date()
    if(req.url=="/")
    {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        console.log(`${now.toLocaleTimeString()}[${req.method}]`)
        res.end("Hello Pretty");
    }
    else if (req.url.startsWith("/api/")){
        res.statusCode = 200;
        const slug  = req.url.slice(5);
        console.log(slug)

        const api_obj = await SqlApi.findOne({where:{slug:slug}})
        var msg = ""
        if(api_obj ==null){
            msg = `${slug} Not Found`;
        }else{
            msg = `Running the sql line:\t${api_obj.sql}`;
        }

        res.setHeader('Content-Type','application/json');
        console.log(`${now.toLocaleTimeString()}[${req.method}]${msg}`)
        res.end(msg);
    }
})

server.listen(port,hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
})