const express = require('express');
const bodyparser = require('body-parser');
const nunjucks = require('nunjucks');
const port = 8001;
const app = express();
const path = require('path');
const flash =  require("connect-flash");
const mongo = require('./mongoDB');
const { RedisClient } = require('redis');
const redis = require('./redisDB');
const pg = require('./postgress');
const session = require('express-session');
const { get } = require('mongoose');

//Configuração   
    //public
    app.use(express.static(path.join(__dirname,"public")))
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(session({
        secret: "my-secret",
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash())
    //bodyparser
    app.use(bodyparser.urlencoded({extended: true}))
    app.use(bodyparser.json())
    //template engine nunjucks
    app.set('view engine','njk')

    nunjucks.configure('views', {
        express:app,
        autoescape: false,
        noCache: true
    })
    //middlewares
    app.use((req,res,next) => {
        res.locals.success = req.flash("success")
        res.locals.error = req.flash("error")
        res.locals.user = []
        next()
    })

    
//Rotas
//criando as rotas


    //renderizar tela de test
    app.get('/test',(req,res)=>{
        res.render('test')
    })
     //rota para renderizar pagina com lista dos posts
    app.get('/timeLine',async (req,res)=>{

        const dataPost = await mongo.getPost()
        res.render('timeLine',{itens:dataPost})

    })
    //renderizar userPage
    app.get('/userPage',async (req,res)=>{
        
        if(req.session.login){

            //lista de postagens
            const filter = req.session.login.email
            const userPost =  await mongo.getPostFilter(filter)
            res.render('userPage',{post:userPost})

        }else{
            res.render('logar')
        }
    })
    //dados pessoais
    app.get('/userPage', async (req, res) =>{
        if(req.session.login){
            res.render('userPage',{login:req.session.login})
        }else{
            res.render('/')
        }
        
    })
    //rotas para renderizar index
    app.get("/", (req,res)=>{
        
        if(req.session.login){
            res.render('logado',{login:req.session.login})
        }else{
            res.render('index')
        }
        
    })
    //rota para renderizar a tela de cadastro
    app.get('/cadastrar', (req,res)=>{
        res.render('cadastrar')
    })
    //rota para tela de login
    app.get('/logar', (req,res)=>{
        res.render('logar')
    })
    //rota para renderizar a tela de postagem
    app.get('/postar', (req,res)=>{
        res.render('postar',)
    })
    //rota para renderizar a tela de edição
    app.get('/editar/:titulo', async (req,res)=>{
        let filter = {titulo: req.params.titulo}
        console.log(filter)
        const postagem =  await mongo.getPostFilter(filter)
        res.render('editar',{post:postagem})
    })

    app.post('/editPost',async (req,res)=>{

        await mongo.updatePost(req.body.id, req.body.titulo, req.body.conteudo).then(()=>{

            req.flash('success','postagem editada com sucesso')
            res.redirect('userPage')

        }).catch(err=>{
            req.flash('error','erro ao editar a postagem')
            console.log(err)
        })

    })



    //cadastrar usuarios no postgress
    app.post('/cadastrar', async (req,res)=>{

        let erros = []
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto:"Nome invalido" })
            console.log(erros)
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email.length < 10){
            erros.push({texto:"Email invalido" })
            console.log(erros)
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha.length < 6){
            erros.push({texto: "Senha muito curta"})
            console.log(erros)
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.nome == null){
            erros.push({texto: "campo obrigatório"})
            console.log(erros)
        }
        if(JSON.stringify(await pg.findUser(req.body.email)) === JSON.stringify({email: req.body.email})){
            erros.push({texto: "Este email ja esta cadastrado"})
        }

        if(erros.length > 0){
            console.log("entrei no if de erros")
            res.render('cadastrar',{erros:erros})
        }else{
            pg.cadastrarUser(req.body.nome,req.body.email, req.body.senha, req.body.nascimento)
            req.flash('success','usuario adicionado com sucesso')
            res.redirect('userPage')
        }

    })

    //logar usuario
    app.post('/logar', async(req,res) => {
        
        
        //email vindo do body em forma do json para ficar igual ao do postgress
        const usr = { email: req.body.email}
        const usrSenha = { senha: req.body.senha}

        let erros = []

        if(JSON.stringify(await pg.findUser(req.body.email)) == JSON.stringify(usr)){

            if(JSON.stringify(await pg.confirmUser(req.body.email)) == JSON.stringify(usrSenha)){

                req.session.login = await pg.getUser(req.body.email)
                //console.log(req.session.login)

                console.log("login realizado com sucesso!");
                res.redirect('userPage',)
                
            }else{
                req.flash('error','senha incorreta')
                res.render('logar')
            }

        }else{
            req.flash('error','email não encontrado')
            res.render('logar')
        }
    })
    //deslogar user
    app.get('/sair',(req,res)=>{
        req.session.login = null
        res.render('/')
    })
    //publicar post
    app.post('/postar',async (req,res)=>{
        
        const usr = { email: req.body.email}

        if(JSON.stringify(await pg.findUser(req.body.email)) == JSON.stringify(usr)){

                const newPost = {
                autor: req.body.email,
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                data: mongo.setData()
                }

                if(req.body.titulo) {
                    mongo.addPost(newPost)
                    res.redirect('/timeLine')
                }else{
                    redis.set(req.body.email, req.body.conteudo)
                    res.redirect('timeLine')
                }
                

        }else{
            res.send("Usuario inexistente")
        }
    })
      
    //apagar mensagem
    app.get('/delete/:titulo',async (req,res)=>{
        const id = {titulo: req.params.titulo}
        await mongo.dellPost(id)
        console.log(id)
        res.redirect('/timeLine')
    })

app.listen(port,()=>{
    console.log("Aplicação esta rodando na porta " + port)
})