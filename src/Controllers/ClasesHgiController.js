const obj = {};
const objSqlClases = require('../Models/Clases');

obj.GetClases = async(req, res)=>{
    objSqlClases.GetClases(req.body).then(rpta=>{
        if(rpta){
            res.json({
                Success: true, strMensaje: rpta
            });
        }else{
            res.json({
                Success: false, strMensaje: "Hubo un error" 
            });
        }
    });
}

module.exports = obj;