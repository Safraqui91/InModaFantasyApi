const databaseSQL = require(`../Databases/databaseSQL.js`);
const obj = {};

obj.GetFacturaTercero = async({strIdTercero, intIdPedido})=>{
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select *,DAY(DatFecha) as 'DatFechaDia', DAY(DatVencimiento) as 'DiaVen',MONTH(DatVencimiento) as 'MesVen', YEAR(DatVencimiento) as 'AnoVen'  from tbldocumentos inner join tblterceros on tblterceros.strIdTercero = tbldocumentos.strtercero where IntTransaccion = 47 and (intdocumento = `+intIdPedido+` or IntDocRef = `+intIdPedido+`) and strtercero = '`+strIdTercero+`'`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

obj.GetDetalleFacturaTercero = async({intIdPedido})=>{
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select *, tbldetalledocumentos.StrUnidad as 'StrUdm' from tbldetalledocumentos
    inner join tblproductos on tblproductos.stridproducto = tbldetalledocumentos.strproducto 
    where IntTransaccion = 47 and intdocumento = `+intIdPedido;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

obj.DuplicarFactura = async({intIdPedido})=>{
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    let sql = `call SP_DuplicarPedido(?);`;
    let rpta = await SQLConexionDASH.query(sql, intIdPedido);
    await SQLConexionDASH.close();
    return rpta['recordset'];
}

module.exports = obj;