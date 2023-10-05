const express = require('express');
const router = express.Router();
const PedidosController = require('../controllers/pedidos-controller')


// Retorna todos os pedido
router.get('/',PedidosController.getPedidos);
// Insere um pedido
router.post('/',PedidosController.postPedidos);
// Retorna os dados de um pedido
router.get('/:id_pedido',PedidosController.getUmPedido);
// Deleta um pedido
router.delete('/',PedidosController.deletePedido);


module.exports = router;