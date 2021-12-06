const objSqlZonas = {};
const databaseSQL = require('../Databases/databaseSQL.js');

objSqlZonas.ConsultarCiudades = async (strIdDepartamento)=>{
    try {
        const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
        let sql = `select * from TblCiudades where StrZona = '${strIdDepartamento}' order by StrDescripcion asc;`;
        let resultCiudades  = await ConexionSQL_HGI.query(sql);
        resultCiudades = resultCiudades['recordset'];
        console.log(resultCiudades);
        await ConexionSQL_HGI.close();
        return resultCiudades;
        return true;
    } catch (error) {
        return false;
    }
}

objSqlZonas.ConsultarDepartamentos = async ()=>{
    try {
        const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
        let sql = `select StrIdZona,StrDescripcion from TblZonas  order by StrDescripcion asc;`;
        let resultDepartamentos = await ConexionSQL_HGI.query(sql);
        resultDepartamentos = resultDepartamentos['recordset'];
        await ConexionSQL_HGI.close();
        return resultDepartamentos;
    } catch (error) {
        console.log(error);
        return false;
    }
}


module.exports = objSqlZonas;