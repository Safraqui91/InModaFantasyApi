const { Router } = require('express');
const router = Router();


const { ConsultarCiudades, ConsultarDepartamentos } = require('../Controllers/ZonasController.js');


//Api/zonas/ciudades
router.route('/ciudades/:strIdDepartamento')
	.get(ConsultarCiudades);
//Api/zonas/departamentos
router.route('/departamentos/')
	.get(ConsultarDepartamentos);
module.exports = router;