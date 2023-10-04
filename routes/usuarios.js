const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/cadastro', (req,res,next) =>{
    mysql.getConnection((error,conn)=>{
        if(error){return res.status(500).send({error:error})}
        //Verifica se o email já existe
        conn.query('select * from usuarios where email=?', [req.body.email],(error,result) => {
            if(result.length > 0){ res.status(409).send({mensagem:"Usuário já cadastrado"})} 
            else { 
        // Cria o Hash da senha
        bcrypt.hash(req.body.senha,10,(errBcrypt,hash)=>{
            if(errBcrypt){return res.status(500).send({error:errBcrypt})}
            conn.query(
                `INSERT INTO usuarios (email, senha) values(?,?)`,
            [ req.body.email,hash ],
              (error,result,fiels) => {
                conn.release();
                if(error){return res.status(500).send({error:error})}   
                const response = {
                    mensagem:"Usuário criado com sucesso",
                    usuarioCriado: {
                        id_usuario: result.insertId,
                        email:req.body.email,
                        request: {
                            tipo:"GET",
                            descricao:"Retorna todos os usuários criados",
                            url:"http://localhost:3000/usuarios"
    
                        }
                    }
    
                }
                return res.status(201).send(response); 
                }
            )

            })  
         }
        })
      

    })

});


router.post('/login',(req,res,next) => {
    mysql.getConnection((error,conn) => {
        if(error){return res.status(500).send({error:error})}
        const query="SELECT * FROM usuarios WHERE email=?";
        conn.query(query,[req.body.email],(error, results,fields)=>{
            conn.release();
            if(error){return res.status(500).send({error:error})}
            if(results.length < 1)  {return res.status(401).send({ mensagem:"Falha na autenticação"})}

            bcrypt.compare(req.body.senha,results[0].senha,(err,result)=>{
            if(err) { return res.status(401).send({ mensagem:"Falha na autenticação"})} 
            
            if(result) {
                const token=jwt.sign({
                    id_usuario:results[0].id_usuario,
                    email:results[0].email,                    
                }, process.env.JWT_KEY, {expiresIn:"1h"}
                );
                return res.status(200).send({mensagem:"Autenticado com Sucesso", token:token
                });
            }
            return res.status(401).send({ mensagem:"Falha na autenticação"});
        
            });
        });         
    });
})


router.get('/', (req, res, next) => {
    mysql.getConnection((error,conn) => {
        if(error){return res.status(500).send({error:error})}
        conn.query(
            'SELECT id_usuario,email FROM usuarios',
            (error,result,fields) => {
                if(error) {return res.status(500).send({error:error})}
                const response= {
                    usuarios: result.map(usuarios => {
                        return{
                            id_usuario:usuarios.id_usuario,
                            email:usuarios.email,
                            resquest:{
                                tipo:"GET", 
                                descricao: "Retorna especificamente um usuarios",
                                url:"http://localhost:3000/usuarios/"+ usuarios.id_usuario
                            }
                        }
                    })

                }
                return res.status(200).send({response})
            }
            
        )
    })
})

module.exports = router;