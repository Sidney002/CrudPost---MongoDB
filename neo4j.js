const neo4j = require('neo4j-driver')
require('dotenv').config();

const uri = 'neo4j://localhost:7687';
const driver = neo4j.driver(uri, neo4j.auth
    .basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
const session = driver.session();

async function addPessoa(obj){
    try{
        const query = 'CREATE (p:Pessoa{nome:"'+obj.nome+'",email:"'+obj.email+'"}) return p';
        await session.run(query).then(result => console.log(result.records[0].length))
    }finally{
        console.log("neo4j")
    }
}

async function addAmizade(email1,email2){
    try{
        const query = 'MATCH (p1:Pessoa),(p2:Pessoa) WHERE p1.email="'+email1+'" and p2.email="'+email2+'" Create (p1)-[:AMIGO]->(p2)';
        await session.run(query).then((result) => {
            if(result.summary.counters._stats.relationshipsCreated > 0){
                console.log(result.summary.counters._stats.relationshipsCreated)
            }else{
                console.log("não foi possivel adicionar a amizade")
            }
            
        }).catch((err)=>{
            return err.message
        })
    }finally {
        console.log("neo4j")
    }
}

async function recomendados(email){
    try{
        let arr = []
        
        const query = 'match(p:Pessoa{email:"'+email+'"})-[:AMIGO]->(:Pessoa)-[:AMIGO]->(j) return j';
        await session.run(query).then((result)=>{
            result.records.forEach((record) => {
                
                arr.push({
                    nome: record._fields[0].properties.nome,
                    email: record._fields[0].properties.email
                })
            })
            console.log("recomendados:")
            console.log(arr)
            return arr
        })
    }finally {
        console.log("neo4j")
    }
}
async function amigos(email){
    try{
        let arr2 = []
        const query = 'match(p:Pessoa{email:"'+email+'"})-[:AMIGO]->(j) return j';
        await session.run(query).then((result)=>{
            result.records.forEach((record) => {
                arr2.push({
                    nome: record._fields[0].properties.nome,
                    email: record._fields[0].properties.email
                })
            })
            console.log("amigos:")
            console.log(arr2)
            return arr2
        })
    }finally {
        console.log("neo4j")
    }

}
//addPessoa({nome: "Scoth Summers", email: "scoth@wolf.com"})
//addAmizade("node@bd.com","neo@bd.com")
//recomendados("scoth@wolf.com")
//amigos("scoth@wolf.com")

module.exports = {
    addAmizade,
    addPessoa,
    recomendados,
    amigos
}
