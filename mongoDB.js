
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
            await user.find().sort({data: "desc"}).forEach(  (item)=>{ arr.push(item)  })
            return arr
        }finally{
            await Client.close()
        }
    }
    async function getPostFilter(filter){
        try{
            await Client.connect()
            .then(()=>{console.log("app conectado ao mongodb")})
            .catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})

            const database = Client.db('crudblog')
            const user = database.collection('Postagens')
            
            //.fin() retorna um obj, o foreach retorna um array apenas com as informações que vamos usar
            
            let arr = []
            await user.find({autor: filter}).sort({data: "desc"}).forEach(  (item)=>{ arr.push(item) })
            
            return arr
            
        }finally{
            await Client.close()
        }
    }
    //função para atualizar mensagens
    async function updatePost(filter,titulo,conteudo){
        try{
            await Client.connect()
            .then(()=>{console.log("app conectado ao mongodb")})
            .catch((err)=>{console.log("não foi possivel conectar ao mongoDB: " +err)})
            //conectando a collection e database passados por parametros
            const user = Client.db('crudblog').collection('Usuarios')

            
            
            await user.updateOne({_id: "ObjectId("+filter+")"},{$set: {titulo: titulo}} , (req, res) => {
                console.log("uma postagem foi editada")
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
            const user = Client.db('crudblog').collection('Postagens')

            await user.deleteOne(id)
            .then(console.log('usuario removido'))
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
    getPostFilter,
    setData
}