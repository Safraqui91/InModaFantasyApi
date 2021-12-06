const { Router } = require('express');
const router = Router();


const { ConsultarPedidosDash,  EnviarPedidoDash, ConsultarPedidoDash, ActualizarPedidoDash, EliminarPedidoDash, ActualizarDetallePedido} = require('../Controllers/PedidosController.js');


//Api/pedidos/
router.route('/')
    .get(ConsultarPedidosDash)
    .post(EnviarPedidoDash)
    .put(ActualizarDetallePedido);
//Api/pedidos/:id_pedido
router.route('/:id_pedido')
    .get(ConsultarPedidoDash)
    .put(ActualizarPedidoDash)
    .delete(EliminarPedidoDash)
module.exports = router;