const express = require ('express');
const app = express();
const morgan = require ('morgan');
const bodyParse = require ('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');
// Gerencia o acesso as rotas 
app.use(morgan('dev'));
// Tornando a pasta acessivel publicamente
app.use('/uploads', express.static('uploads'));
// Aceita dados simples
app.use(bodyParse.urlencoded({extended: false}));
// Apenas JSON de entrada no body
app.use(bodyParse.json());
// Tratativas do cabeçalho 
app.use((req, res, next) => {
    // Configuração de origem do acesso
    res.header('Acess-Control-Allow-Origin','*');
    // Propriedades de cabeçalho aceitas
    res.header(
        'Acess-Control-Allow-Header', 
        'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
    );
    // Metodos que podem ser retornados
    if(req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE','GET');
        return res.status(200).send({})
    }
    next();
});



//rotas disponiveis para acesso
app.use('/produtos',rotaProdutos);
app.use('/pedidos',rotaPedidos);
app.use('/usuarios',rotaUsuarios);

app.use((req, res, next)=>{
    const erro = new Error('Não Encontrado');
    erro.status = 404;
    next(erro);
});



app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});




module.exports = app;