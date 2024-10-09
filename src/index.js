const express = require("express")  
const app = express()
const port = 3009    

app.use("/",(req,res)=>{
    res.end("hyyyyyyyyy")
})

app.listen(port)
 