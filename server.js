require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
// CONECTA NA BASE  USA O DOTENV PARA ESCONDER A SENHA NO .ENV
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {
		//RETORNA UM VALOR PARA QUE POSSA USAR O APP.ON PARA PUXAR A BASE PRIMEIRO
		app.emit('pronto')
	})
	.catch(e => console.log(e));
// SALVA A SESSÃO NA MEMORIA (EX: UM USUARIO FICA LOGADO AUTOMATICAMENTE)
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet')
const csrf = require('csurf')
const {meuMiddleware, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middlewares');
// Helmt é usado para segurança do site
app.use(helmet())
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'secret()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
// use faz com que sempre fique rodando
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
// Injeta tokens para depois checar se não foi enviado por alguem de fora
app.use(csrf());
//Middlewares
app.use(meuMiddleware);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('pronto', () => {
	app.listen(3000, () => {
		console.log('Acessar http://localhost:3000');
		console.log('Servidor Executando na porta 3000');
	});
})
