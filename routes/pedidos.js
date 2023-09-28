const express = require('express');
const router = express.Router();

// Retorna todos os pedido
router.get('/',(req,res,next) => {
    res.status(200).send({
        mensagem:'usando o get dentro da rota de pedidos'
    });
});
// Insere um pedido
router.post('/',(req, res, next)=> {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    };
    res.status(201).send({
        mensagem:'usando o post dentro da rota de pedidos',
        pedidoCriado: pedido

    });
});
// Retorna os dados de um pedido
router.get('/:id_pedido',(req,res,next) => {
    const id =req.params.id_pedido
    if(id=='especial') {
        res.status(200).send({
            mensagem:'Você achou',
            id:id  });
    } else {
        res.status(200).send({
            mensagem: 'Você passou um ID' });  
        }   
});


// Deleta um pedido
router.delete('/',(req, res, next)=> {
    res.status(201).send({
        mensagem:'usando o delete dentro da rota de pedido'
    });
});


module.exports = router;