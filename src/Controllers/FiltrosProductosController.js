const databaseSQL = require('../Databases/databaseSQL.js');
const sqlCon = require('../Databases/DbHgi.js');
const objFiltros = {};


objFiltros.GetMateriales = async (req, res)=>{
    const {id_clase, lineas_ids, grupos_ids, tipos_ids } = req.query;
    const sql = `select TblProdParametro2.StrIdPParametro, TblProdParametro2.StrDescripcion from tblproductos 
    inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
    inner join TblProdParametro2 on TblProdParametro2.StrIdPParametro = TblProductos.StrPParametro2
    where tblproductos.StrClase='${id_clase}'
    and tblproductos.IntHabilitarProd=1
    ${lineas_ids == 0? '': `and tblproductos.StrLinea in('${lineas_ids}')` }  
    ${grupos_ids == 0? '': `and tblproductos.StrGrupo in('${grupos_ids}')` }  
    ${tipos_ids == 0? '': `and tblproductos.StrTipo in('${tipos_ids}')` }  
    and TblProdParametro2.StrIdPParametro != '0' 
    group by TblProdParametro2.StrIdPParametro, TblProdParametro2.StrDescripcion `;
    
    let SQLConexionHGI = new sqlCon();
    try {
        let rpta = await SQLConexionHGI.execute(sql);
        res.json({
            strData: rpta.recordset
        });
    } catch (error) {
        console.log("error materiales --------- ")
        console.log(error)
    } finally {
        SQLConexionHGI.close();
    }
}

objFiltros.GetSexos = async (req, res)=>{
    const {id_clase, lineas_ids, grupos_ids, tipos_ids } = req.query;
    const sql = `select TblProdParametro1.StrIdPParametro1, TblProdParametro1.StrDescripcion from tblproductos 
    inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
    inner join TblProdParametro1 on TblProdParametro1.StrIdPParametro1 = TblProductos.StrPParametro1
    where tblproductos.StrClase='${id_clase}' 
    and (tblproductos.IntHabilitarProd=1 or tblproductos.IntHabilitarProd=0)
    ${lineas_ids == 0? '': `and tblproductos.StrLinea in('${lineas_ids}')` }  
    ${grupos_ids == 0? '': `and tblproductos.StrGrupo in('${grupos_ids}')` }  
    ${tipos_ids == 0? '': `and tblproductos.StrTipo in('${tipos_ids}')` }  
    and TblProdParametro1.StrIdPParametro1 != '0' 
    group by TblProdParametro1.StrIdPParametro1, TblProdParametro1.StrDescripcion`;
    let SQLConexionHGI = new sqlCon();
    try {
        let rpta = await SQLConexionHGI.execute(sql);
        res.json({
            strData: rpta.recordset
        });
    } catch (error) {
        console.log("error sexos --------- ")
        console.log(error)
    } finally {
        SQLConexionHGI.close();
    }
}

objFiltros.GetMarcas = async (req, res)=>{
    const {id_clase, lineas_ids, grupos_ids, tipos_ids } = req.query;
    const sql = `select TblProdParametro3.StrIdPParametro, TblProdParametro3.StrDescripcion from tblproductos 
    inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
    inner join TblProdParametro3 on TblProdParametro3.StrIdPParametro = TblProductos.StrPParametro3
    where tblproductos.StrClase='${id_clase}'
    and (tblproductos.IntHabilitarProd=1 or tblproductos.IntHabilitarProd=0)
    ${lineas_ids == 0? '': `and tblproductos.StrLinea in('${lineas_ids}')` } 
    ${grupos_ids == 0? '': `and tblproductos.StrGrupo in('${grupos_ids}')` }  
    ${tipos_ids == 0? '': `and tblproductos.StrTipo in('${tipos_ids}')` }   
    and TblProdParametro3.StrIdPParametro != '0' 
    group by TblProdParametro3.StrIdPParametro, TblProdParametro3.StrDescripcion`;
    let SQLConexionHGI = new sqlCon();
    try {
        let rpta = await SQLConexionHGI.execute(sql);
        res.json({
            strData: rpta.recordset
        });
    } catch (error) {
        console.log("error marcas --------- ")
        console.log(error)
    } finally {
        SQLConexionHGI.close();
    }
    
}

module.exports = objFiltros;