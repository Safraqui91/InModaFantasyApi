const { Router } = require('express');
const router = Router();
const databaseSQL = require('../Databases/databaseSQL.js');


//Api/usuarios/
router.route('/')
	.get(async (req, res)=>{
        const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
        res.json({
            rpta : SQLConexionHGI
        })
    });

module.exports = router;