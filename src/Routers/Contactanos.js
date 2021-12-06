const { Router } = require('express');
const router = Router();

const { EnviarComentario } = require('../Controllers/ContactanosController.js');

//Api/contactanos/
router.route('/')
	.post(EnviarComentario);
module.exports = router;