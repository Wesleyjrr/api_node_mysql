const express = require('express');
const router = express.Router();

// Retorna todos os produtos
router.get('/',(req,res,next) => {
    res.status(200).send({
        mensagem:'usando o get dentro da rota de produtos'
    });
});
// Insere um produto
router.post('/',(req, res, next)=> {
    const produto ={
        nome: req.body.nome,
        preco: req.body.preco
    };

    res.status(201).send({
        mensagem:'usando o post dentro da rota de produtos',
        produtoCriado: produto
    });
});
// Retorna os dados de um produto
router.get('/:id_produto',(req,res,next) => {
    const id =req.params.id_produto
    if(id=='especial') {
        res.status(200).send({
            mensagem:'Você achou',
            id:id  });
    } else {
        res.status(200).send({
            mensagem: 'Você passou um ID' });  
        }   
});


// Atualiza um produto
router.patch('/',(req, res, next)=> {
    res.status(201).send({
        mensagem:'usando o patch dentro da rota de produtos'
    });
});

// Deleta um produto
router.delete('/',(req, res, next)=> {
    res.status(201).send({
        mensagem:'usando o delte dentro da rota de produtos'
    });
});


module.exports = router;