const { Router } = require('express');
const router = Router();
const multer  = require('multer');
//const upload = multer({ dest: 'uploads/' });

const { RegistrarUsuario, RegistrarUsuarioJwt, IniciarSesionJwt, IniciarSesion, ValidarEmail, CambiarClaveUsuaro, EnviarTokenEmail, validacionCompras, actualizarPrecio} = require('../Controllers/UsuariosController.js');
const authJwt = require('../authenticate.js');



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + '-' + Date.now()+'.'+file.mimetype.split("/")[1])
	}
})
   
const upload = multer({ storage: storage })
const cpUpload = upload.fields([{ name: 'file', maxCount: 3 }])
//Api/usuarios/
router.route('/registro')
	.post(cpUpload, RegistrarUsuarioJwt);
//Api/usuarios/
router.route('/iniciosesion')
	.post(IniciarSesionJwt);
//Api/usuarios/:strEmail
router.route('/email/:strEmail')
	.get(ValidarEmail);
//Api/usuarios/:strEmail
/*router.route('/validartk/:strIdToken')
	.get(ValidarTokenCambioClave);*/
//Api/usuarios/:strEmail
router.route('/token')
	.get(authJwt.verifyToken, (req, res)=> res.status(200));
router.route('/enviarTokenEmail')
	.post(EnviarTokenEmail);
router.route('/cambiarclave')
	.put(authJwt.verifyToken, CambiarClaveUsuaro);
router.route('/validacionCompras')
	.get(validacionCompras);
router.route('/actualizarPrecio')
	.put(actualizarPrecio);
module.exports = router;