const { Router } = require('express');
const router = Router();


const { ConsultarDependencia, ActualizarDependencia, NuevaDependencia } = require('../Controllers/DependenciasController.js');


//Api/dependencia/
router.route('/:strIdTercero')
	.get(ConsultarDependencia);

router.route('/dependencia/')
    .post(ActualizarDependencia);

router.route('/dependencia/new')
    .post(NuevaDependencia);
    
module.exports = router;