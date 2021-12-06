const { Router } = require('express');
const router = Router();


const { ConsultarTercero, ActualizarTerceroGeneral, ActualizarTerceroTributaria } = require('../Controllers/TercerosController.js');


//Api/usuarios/
router.route('/tercero/:strIdTercero')
	.get(ConsultarTercero);

router.route('/terceroGeneral/')
	.post(ActualizarTerceroGeneral);
router.route('/terceroTributaria/')
	.post(ActualizarTerceroTributaria);
module.exports = router;