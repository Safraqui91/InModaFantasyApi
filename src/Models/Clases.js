const databaseSQL = require(`../Databases/databaseSQL.js`);
const obj = {};

obj.GetClases = async(req, res)=>{
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select StrIdClase,StrDescripcion from TblClases where TblClases.IntTipo <> 1;`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

module.exports = obj;