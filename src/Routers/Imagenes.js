const {Router} = require('express');
const router=Router();

const {GetImagen,GetImagenesReferencia, GetImagenIdProducto} = require('../Controllers/ImagenesController.js');

//Api/Imagenes
router.route('/')
      .get(GetImagen);

router.route('/orden/:strIdProducto')
      .get(GetImagenesReferencia);
module.exports=router;