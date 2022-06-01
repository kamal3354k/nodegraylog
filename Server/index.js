const express = require("express")
const app = express();
let log = require("./logger")

app.use(express.json())

console.log(process.env.PORT)


app.post("/",(req,res)=>{
    res.send(req.body)
    console.log(req.body)
    let data = {
        requestOrigin: req.body.requestOrigin,
        messageKey: req.body.messageKey
    }
    log(data.requestOrigin,data.messageKey)
    console.log(log(data.requestOrigin,data.messageKey))
})







app.listen(process.env.PORT)