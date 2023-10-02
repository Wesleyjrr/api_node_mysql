const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.post('/', (req,res,next) =>{
    mysql.getConnection((error,conn)=>{
        if(error){res.status(500).send({error:error})}
        conn.query(
            'INSERT INTO usuarios (email, senha) values(?,?)'
            ),
        [ req.body.email,
          req.body.senha ],
          (error,result,fiels) => {
            conn.release();
            if(error){res.status(500).send({error:error})}
            const response = {
                mensagem:"Usuário criado com sucesso",
                usuarioCriado: {
                    id_usuario: result.id_usuario,
                    email:req.body.email,
                    request: {
                        tipo:"GET",
                        descricao:"Retorna todos os usuários criados",
                        url:"http://localhost:3000/usuarios"

                    }
                }

            }
            res.status(201).send(response);

          }

    })

});

module.exports = router;