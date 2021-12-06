const {Router} = require('express');
const router=Router();

const {GetProductosPorCategoria,GetLineasPorClaseProducto,GetProductoEspecifico, GetTipos, GetGrupos, GetProductosPorReferncia, GetProductosRelacionados} = require('../Controllers/ProductosController.js');

//  /api/productos obtiene productos por clase y linea
router.route('/categoria/')
      .get(GetProductosPorCategoria);
//  /api/productos obtiene productos por descripcion o idreferencia y lista de precio segun el tercero
router.route('/dash/')
      .get(GetProductosPorReferncia);
//  /api/productos obtiene las lineas de los productos
router.route('/categoria/lineas/:id_clase/:lista_precio')
      .get(GetLineasPorClaseProducto);
router.route('/categoria/grupos/:id_clase/:id_linea/:lista_precio')
      .get(GetGrupos);
router.route('/categoria/tipos/:id_clase/:id_linea/:id_grupo/:lista_precio')
      .get(GetTipos);
      
//  /api/productos obtiene los productos relacionados de acuerdo a una lista de referencias      
router.route('/relacionados/')
.get(GetProductosRelacionados);
 //  /api/productos obtiene las lineas de los productos
router.route('/:id_producto')
      .get(GetProductoEspecifico);
//  /api/productos obtiene los productos segun la conincidencia de la descripcion o la referencia
/*router.route('/general')
      .get(GetProductoFiltroGeneral);*/
module.exports=router;