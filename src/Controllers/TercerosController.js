const objTerceros = {};
const databaseSQL = require('../Databases/databaseSQL.js');
const objSqlUsuarios = require('../Models/Usuarios');
const objSqlTerceros = require('../Models/Tercero');

objTerceros.ConsultarTercero = async (req, res)=>{
    const {strIdTercero} = req.params;
    objSqlUsuarios.GetTercero(strIdTercero).then(JsonTercero=>{
        res.json({
            Success: true, strMensaje: JsonTercero 
        });
    });  
}

objTerceros.ActualizarTerceroGeneral = async (req, res)=>{
    objSqlTerceros.UpdateTerceroGeneral(req.body).then(rptaHgi=>{
        if(rptaHgi){
            res.json({
                Success: true, strMensaje: "Información actualizada" 
            });
        }else{
            res.json({
                Success: false, strMensaje: "Hubo un error al actualizar" 
            });
        }
    });  
}

objTerceros.ActualizarTerceroTributaria = async (req, res)=>{
    objSqlTerceros.UpdateTerceroTributaria(req.body).then(rptaHgi=>{
        if(rptaHgi){
            res.json({
                Success: true, strMensaje: "Información actualizada" 
            });
        }else{
            res.json({
                Success: false, strMensaje: "Hubo un error al actualizar" 
            });
        }
    });  
}

module.exports = objTerceros;