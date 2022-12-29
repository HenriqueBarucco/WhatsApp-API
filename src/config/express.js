const express = require('express')
const path = require('path')
const exceptionHandler = require('express-exception-handler')
exceptionHandler.handle()
const app = express()
const cors = require('cors')
const error = require('../api/middlewares/error')
const tokenCheck = require('../api/middlewares/tokenCheck')
const { protectRoutes } = require('./config')

app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../api/views'))
global.WhatsAppInstances = {}

const routes = require('../api/routes/')
if (protectRoutes) {
    app.use(tokenCheck)
}
app.use('/', routes)
app.use(error.handler)

const allowedOrigins = ['https://projetos.grupocriar.com.br'];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));

module.exports = app
