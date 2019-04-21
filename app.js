const app   = require('express')();
const scrap = require('./scrap');
const port  = process.env.PORT || 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "*")
    next()
})
app.get("/", async function(req, res){
    scrap.then(respon => {
        res.json(respon)
    });    
})

var server = app.listen(port, () => {
    var host = server.address().address;
    console.log('Server running on http://%s:%s', host, port)
})