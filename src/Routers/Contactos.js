const {Router} = require('express');
const router = Router();

const {ConsultarContactos, CrearContacto, ActualizarContacto} = require('../Controllers/ContactosController');

//api/contactos/
router.route('/:strIdTercero')
	.get(ConsultarContactos);

router.route('/')
    .post(CrearContacto)
    .put(ActualizarContacto);
    
module.exports = router;