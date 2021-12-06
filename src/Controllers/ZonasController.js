const objZonas = {};
const databaseSQL = require('../Databases/databaseSQL.js');
const objSqlZonas = require('../Models/Zonas');

objZonas.ConsultarCiudades = async (req, res)=>{
    const {strIdDepartamento} = req.params;
    objSqlZonas.ConsultarCiudades(strIdDepartamento).then(rpta =>{
        if(rpta){
            res.json({
                Success: true, strMensaje: rpta 
            });
        }else{
            res.json({
                Success: false, strMensaje: rpta 
            });
        }
    })
}

objZonas.ConsultarDepartamentos = async (req, res)=>{
    console.log("holaaa consultar departamentos");
    objSqlZonas.ConsultarDepartamentos().then(rpta =>{
        if(rpta){
            res.json({
                Success: true, strMensaje: rpta 
            });
        }else{
            res.json({
                Success: false, strMensaje: rpta 
            });
        }
    })
}

module.exports = objZonas;