const {Router} = require('express');
const router=Router();

const {GetMateriales,GetMarcas,GetSexos} = require('../Controllers/FiltrosProductosController.js');


router.route('/material')
      .get(GetMateriales);

router.route('/marca')
      .get(GetMarcas);

router.route('/sexo')
      .get(GetSexos);
module.exports=router;