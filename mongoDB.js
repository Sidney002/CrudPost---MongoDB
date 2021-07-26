require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
//sintax = mongodb://bancourl/porta
const Client = new MongoClient('mongodb://172.19.0.2/27017}',
    {useUnifiedTopology: true});

//Funções de postagens    
    async function getPost(){
        try{
            await Client.connect()
            .then(()=>{console.log("app conectado ao mongodb")})
            .catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})

            const database = Client.db('crudblog')
            const user = database.collection('Postagens')
            
            //.fin() retorna um obj, o foreach retorna um array apenas com as informações que vamos usar
            
            let arr = []
            await user.find().forEach(  (item)=>{ arr.push(item)  })
            return arr
        }finally{
            await Client.close()
        }
    }
    getPost()
    //função para atualizar mensagens
    async function updatePost(){
        try{
            await Client.connect()
            .then(()=>{console.log("app conectado ao mongodb")})
            .catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            const query = {data: 14.091999}
            const update = {$set: {data: 14091999}}
            await user.updateOne(query, update). then(console.log("Usuario atualizado")).catch((err)=>{
                console.log("erro a atualizar o usuario: " + err)
            })

        }finally{
            await Client.close()
        }
    }

    //a função de adicionar postagens 
    async function addPost(obj){
        
        try{
            await Client.connect()
            .then(()=>{console.log("app conectado ao mongodb")})
            .catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Postagens')

            await user.insertOne(obj)
            .then(console.log("mensagem postada com sucesso"))
            .catch((err)=>{console.log("não foi possivel realizar a postagem: " +err)})
        }finally{
            await Client.close()
        }
    }
    //mesma coisa, função de deletar mensagem
    //o filtro que vai ser passado por parametro sera = titulo = titulo da mensagem
    //  dellPser({Titulo: 'boa noite'})
    async function dellPost(id){
        try{
            await Client.connect()
            .then(()=>{console.log("app conectado ao mongodb")})
            .catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            await user.deleteOne({titulo: id})
            .then(console.log('${result.deletecount} usuario removido'))
            .catch((err)=>{console.log("não foi possivel remover o usuario: " + err)})
            

        }finally{
            Client.close()
        }

    }
    const data = new Date()
        setData = ()=>{
            let dia = data.getDate()
            let mes = data.getMonth()
            let ano = data.getFullYear()
            let hora = data.getHours()
            let minutos = data.getMinutes()
            let dt = dia + "/" + mes + "/"+ ano + "  as  "+ hora+":"+minutos
            return dt
            console.log(dt)      
        }
module.exports = {
    Client,
    MongoClient,
    addPost,
    getPost,
    dellPost,
    updatePost,
    setData
}