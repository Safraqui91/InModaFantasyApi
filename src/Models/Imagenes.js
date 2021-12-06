const objSqlImagenes = {};
const databaseSQL = require('../Databases/databaseSQL.js');


objSqlImagenes.GetImagenesReferencia = async(strIdProducto)=>{
    //Conexion SQLserver
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    //Consulta sql productos
    let sql = `select StrIdCodigo, StrDescripcion,IntOrden,StrArchivo from 
    tblimagenes where (TblImagenes.StrIdCodigo = '`+strIdProducto+`') 
    and TblImagenes.IntOrden = 1
    order by TblImagenes.IntOrden asc;`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}


module.exports = objSqlImagenes;