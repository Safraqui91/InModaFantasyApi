const {Router} = require('express');
const router=Router();

const {GetClases} = require('../Controllers/ClasesHgiController.js');

router.route('/')
      .get(GetClases);
module.exports=router;