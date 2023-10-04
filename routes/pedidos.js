const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


// Retorna todos os pedido
router.get('/',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            `SELECT 
                    pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome,
                    produtos.preco
            FROM pedidos
      INNER JOIN produtos
            ON produtos.id_produto = pedidos.id_produto`,
            (error, result, fileds) => {
                if(error) {return res.status(500).send({error: error})} 
                const response ={
                    pedidos:result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade:pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco:pedido.preco
                            },                                                
                            request :{
                                tipo:'GET',
                                descricao:"Retorna os detalhes de um pedido especifico",
                                url:"http://localhost:3000/pedidos/"+ pedido.id_pedido
                            }


                        }
                    })
                }
                res.status(200).send({response});             
            }
            )
           
    });
});
// Insere um pedido
router.post('/',(req, res, next)=> {
    mysql.getConnection((error,conn) => {
       if(error) {return res.status(500).send({ error:error})}
       //Verificando se o produto existe 
       conn.query( 'SELECT * FROM produtos WHERE id_produto = ?', 
       [req.body.id_produto],         
       (error, result, field) => {
        if(error) {return res.status(500).send({ error:error})};
        if(result.length == 0) { return res.status(404).send({mensagem:"Produto não encontrado"}) }
        })
        conn.query(
            'INSERT INTO pedidos (id_produto,quantidade) VALUES (?,?)',
            [   req.body.id_produto, 
                req.body.quantidade],
            (error,result,field) => {
               conn.release(); 
               if(error) {return res.status(500).send({error: error})}
                const response = {
                    mensagem:"Pedido cadastrado com Sucesso",
                    pedidoCriado: {
                        id_pedido: result.insertId,
                        id_produto: req.body.id_produto,
                        quantidade:req.body.quantidade,
                        request: {
                            tipo:"GET",
                            descricao:"Retorna todos os pedidos",
                            url:"http://localhost:3000/pedidos"
                        }
                    }

                }
                res.status(201).send({response});
            }          
        )

                 
    })
});

// Retorna os dados de um pedido
router.get('/:id_pedido',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send({error:error})}
        conn.query(
            'SELECT * FROM pedidos where id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if(error) {
                    return res.status(500).send({error: error});
               }
               if(result.length == 0) { return res.status(404).send({mensagem:"Não foi encontrado nenhum pedido com este ID"})}

               const response = {
                pedido: {
                id_produto: result[0].id_pedido,
                nome: result[0].id_produto,
                quantidade: result[0].quantidade,
                request: {
                    tipo:"GET",
                    descricao:"Retorna todos o pedidos",
                    url:"http://localhost:3000/produtos"
                }
                }
               }
               res.status(200).send({response})
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
            (error,result,field) => {
               conn.release(); 
               if(error) {return res.status(500).send({error: error})}
               
               if(result.length == 0) {return res.status(404).send({ mensagem:"Este ID não existe!"})}

               const response= {
                mensagem:"Pedido removido com sucesso",
                request: {
                    tipo:"POST",
                    descricao:" Insere um novo pedido",
                    url:"http://localhost:3000/pedidos",
                    body:{
                        id_produto:"Number",
                        quantidade:"Number"
                    }
                }

               }

               res.status(202).send({response})
            }          
        )
    });
});


module.exports = router;