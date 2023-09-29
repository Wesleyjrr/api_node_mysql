const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// Retorna todos os pedido
router.get('/',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM pedidos;',
            (error, resultado, fileds) => {
                if(error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                    });
               }
               res.status(200).send({
                response:resultado
            })
            }

        )  
    })
});
// Insere um pedido
router.post('/',(req, res, next)=> {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            'INSERT INTO pedidos (id_produto,quantidade) VALUES (?,?)',
            [   req.body.id_produto, 
                req.body.quantidade],
            (error,resultado,field) => {
               conn.release(); 
               if(error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                    });
               }
               res.status(201).send({
                mensagem:"Pedido inserido com sucesso",
                id_pedido: resultado.insertId
            })
            }          
        )
    });
});
// Retorna os dados de um pedido
router.get('/:id_pedido',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM pedidos where id_pedido = ?;',
            [req.params.id_pedido],
            (error, resultado, fileds) => {
                if(error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                    });
               }
               res.status(200).send({
                response:resultado
            })
            }
        )  
    })
});


// Deleta um pedido
router.delete('/',(req, res, next)=> {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            `DELETE FROM pedidos
                WHERE id_pedido = ? `,
            [req.body.id_pedido],
            (error,resultado,field) => {
               conn.release(); 
               if(error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                    });
               }
               res.status(202).send({
                mensagem:"Pedido removido com sucesso",
            })
            }          
        )
    });
});


module.exports = router;