const http  = require("http");

const hostname  = "0.0.0.0";
const port = 3000;

const server = http.createServer((req,res)=>{
    const now = new Date()
    if(req.url=="/")
    {
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        console.log(`${now.toLocaleTimeString()}[${req.method}]`)
        res.end("Hello Pretty");
    }
    else if (req.url=="/api"){
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        console.log(`${now.toLocaleTimeString()}[${req.method}]API`)
        res.end(JSON.stringify({data:{somedata:[123]}}));
    }
})

server.listen(port,hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
})