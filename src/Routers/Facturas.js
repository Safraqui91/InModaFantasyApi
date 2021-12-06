const {Router} = require('express');
const router=Router();

const {GetFacturasPorTercero, GetDetallePorFactura, DescargarFactura, DuplicarFactura} = require('../Controllers/FacturasController.js');

//  /api/facturas obtiene las facturas del cliente
router.route('/:id_tercero')
      .get(GetFacturasPorTercero);
//  /api/detalle obtiene el detalle de la factura
router.route('/detalle/:id_factura/:tipo_pedido')
      .get(GetDetallePorFactura);
// /api/facturas
router.route('/descarga/:int_documento/:id_tercero')
      .get(DescargarFactura);
// /api/facturas
router.route('/duplicar')
      .post(DuplicarFactura);
module.exports=router;