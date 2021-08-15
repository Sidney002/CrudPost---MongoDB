const redis = require("redis");
require('dotenv').config();

const Redis_client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

Redis_client.on("connect",(error)=>{console.log("Redis_Client Connected")})

async function set(key, post){
    await Redis_client.set(key, JSON.stringify(post), "EX", 7200);
    console.log("Rascunho salvo no redis")
}
function get(key){
    let arr = []
        Redis_client.get(key,function(err,reply){
        if(reply!= null){
            arr.push(reply)
            console.log(arr)
        }
        else{ console.log("chave não encontrada")}

            return arr
    })
}
module.exports = {
    set,
    get
}