const objSqlProductos = {};
const objProductos = require('../Controllers/ProductosController.js');
const databaseSQL = require('../Databases/databaseSQL.js');
const sqlCon = require('../Databases/DbHgi.js');

objSqlProductos.GetProductosPorCategoria = async (dataJson) => {
    //Calculando paginacion
    let intInicioPaginacion = 30;
    let sql = `
    select * from(
        select * from(select
            tblproductos.StrIdProducto,TblProductos.StrDescripcion,
            cast(TblProductos.IntPrecio${dataJson.lista_precio} as int) as IntPrecio,
            convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
            convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
            convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
            ,StrParam3,strauxiliar as 'IntCantidadMedida',strunidad as 'StrUnidadMedida',
            TblImagenes.StrArchivo as 'StrRuta',
            tblproductos.IntHabilitarProd
            from tblproductos
            inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
            inner join TblProdParametro1 ON TblProdParametro1.stridpparametro1 = tblproductos.StrPParametro1
            inner join TblProdParametro2 ON TblProdParametro2.stridpparametro = tblproductos.StrPParametro2
            inner join TblProdParametro3 ON TblProdParametro3.stridpparametro = tblproductos.StrPParametro3
            where
            tblproductos.IntHabilitarProd in(1)
            ${dataJson.id_clase == '' ? '' : ` and tblproductos.StrClase = '${dataJson.id_clase}'`} 
            ${dataJson.lineas_ids == '' ?
            dataJson.strIdLineaActiva == 0 ? '' : `and tblproductos.StrLinea in('${dataJson.strIdLineaActiva}')`
            : `and tblproductos.StrLinea in('${dataJson.lineas_ids}')`} 
            ${dataJson.grupos_ids == '' ?
            dataJson.strIdGrupoActivo == 0 ? '' : `and tblproductos.StrGrupo in('${dataJson.strIdGrupoActivo}')`
            : `and tblproductos.StrGrupo in('${dataJson.grupos_ids}')`} 
            ${dataJson.tipos_ids == '' ?
            dataJson.strIdTipoActivo == 0 ? '' : `and tblproductos.StrTipo in('${dataJson.strIdTipoActivo}')`
            : `and tblproductos.StrTipo in('${dataJson.tipos_ids}')`} 
            ${dataJson.materiales_ids == '' ? '' : `and tblproductos.StrPParametro2 in('${dataJson.materiales_ids}')`} 
            ${dataJson.marcas_ids == '' ? '' : `and tblproductos.StrPParametro3 in('${dataJson.marcas_ids}')`} 
            ${dataJson.sexos_ids == '' ? '' : `and tblproductos.StrPParametro1 in('${dataJson.sexos_ids}')`}
            ${dataJson.filtro_texto == '' ? '' : `and (tblproductos.StrDescripcion like '%${dataJson.filtro_texto}%' or tblproductos.StrIdProducto like '%${dataJson.filtro_texto}%')`} 
         ) as tabla1
         union
         select * from (
            select top 10
            tblproductos.StrIdProducto,TblProductos.StrDescripcion,
            cast(TblProductos.IntPrecio${dataJson.lista_precio} as int) as IntPrecio,
            convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
            convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
            convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
            ,StrParam3,strauxiliar as 'IntCantidadMedida',strunidad as 'StrUnidadMedida',
            TblImagenes.StrArchivo as 'StrRuta',
            tblproductos.IntHabilitarProd
            from tblproductos
            inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
            inner join TblProdParametro1 ON TblProdParametro1.stridpparametro1 = tblproductos.StrPParametro1
            inner join TblProdParametro2 ON TblProdParametro2.stridpparametro = tblproductos.StrPParametro2
            inner join TblProdParametro3 ON TblProdParametro3.stridpparametro = tblproductos.StrPParametro3
            where
            tblproductos.IntHabilitarProd in(0)
            ${dataJson.id_clase == '' ? '' : ` and tblproductos.StrClase = '${dataJson.id_clase}'`} 
            ${dataJson.lineas_ids == '' ?
            dataJson.strIdLineaActiva == 0 ? '' : `and tblproductos.StrLinea in('${dataJson.strIdLineaActiva}')`
            : `and tblproductos.StrLinea in('${dataJson.lineas_ids}')`} 
            ${dataJson.grupos_ids == '' ?
            dataJson.strIdGrupoActivo == 0 ? '' : `and tblproductos.StrGrupo in('${dataJson.strIdGrupoActivo}')`
            : `and tblproductos.StrGrupo in('${dataJson.grupos_ids}')`} 
            ${dataJson.tipos_ids == '' ?
            dataJson.strIdTipoActivo == 0 ? '' : `and tblproductos.StrTipo in('${dataJson.strIdTipoActivo}')`
            : `and tblproductos.StrTipo in('${dataJson.tipos_ids}')`} 
            ${dataJson.materiales_ids == '' ? '' : `and tblproductos.StrPParametro2 in('${dataJson.materiales_ids}')`} 
            ${dataJson.marcas_ids == '' ? '' : `and tblproductos.StrPParametro3 in('${dataJson.marcas_ids}')`} 
            ${dataJson.sexos_ids == '' ? '' : `and tblproductos.StrPParametro1 in('${dataJson.sexos_ids}')`}
            ${dataJson.filtro_texto == '' ? '' : `and (tblproductos.StrDescripcion like '%${dataJson.filtro_texto}%' or tblproductos.StrIdProducto like '%${dataJson.filtro_texto}%')`} 
        ) as tabla2
    ) as tabla3
        ORDER BY NEWID()
        OFFSET ${(intInicioPaginacion * dataJson.num_paginacion) - intInicioPaginacion} ROWS FETCH NEXT ${intInicioPaginacion} ROWS ONLY;
        `;

    const SQLConexionHGI = new sqlCon();
    try {
        let rpta = await SQLConexionHGI.execute(sql);
        return rpta.recordset;
    } catch (error) {
        console.log("controlador")
        console.log(error);
    }
}

objSqlProductos.GetImagenesProductos = async (dataJson) => {
    const SQLConexionHGI = new sqlCon();
    let sql = `select StrIdCodigo,IntOrden,StrArchivo,StrDescripcion from 
    tblimagenes where (TblImagenes.StrIdCodigo in(select tblproductos.StrIdProducto from TblProductos where tblproductos.IntHabilitarProd=1)) and TblImagenes.StrArchivo <> '' order by TblImagenes.StrDescripcion asc;`;
    try {
        let rpta = await SQLConexionHGI.execute(sql);
        return rpta.recordset;
    } catch (error) {

    }
}

objSqlProductos.GetCantProductosClase = async (dataJson) => {
    //Conexion SQLserver
    const SQLConexionHGI = new sqlCon();
    /*let sql = `select count(*) as 'CantProductos' from tblproductos  
    inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
    where 
    tblproductos.IntHabilitarProd=1
    ${dataJson.id_clase == ''? '': ` and tblproductos.StrClase = '${dataJson.id_clase}'` } 
    ${dataJson.lineas_ids == ''? 
    dataJson.strIdLineaActiva == 0 ? '' : `and tblproductos.StrLinea in('${dataJson.strIdLineaActiva}')`
    : `and tblproductos.StrLinea in('${dataJson.lineas_ids}')` } 
    ${dataJson.grupos_ids == ''? 
        dataJson.strIdGrupoActivo == 0 ? '' : `and tblproductos.StrGrupo in('${dataJson.strIdGrupoActivo}')`
    : `and tblproductos.StrGrupo in('${dataJson.grupos_ids}')` } 
    ${dataJson.tipos_ids == ''? 
        dataJson.strIdTipoActivo == 0 ? '' : `and tblproductos.StrTipo in('${dataJson.strIdTipoActivo}')`
    : `and tblproductos.StrTipo in('${dataJson.tipos_ids}')` } 
    ${dataJson.materiales_ids == ''? '': `and tblproductos.StrPParametro2 in('${dataJson.materiales_ids}')` } 
    ${dataJson.marcas_ids == ''? '': `and tblproductos.StrPParametro3 in('${dataJson.marcas_ids}')` } 
    ${dataJson.sexos_ids == ''? '': `and tblproductos.StrPParametro1 in('${dataJson.sexos_ids}')` } 
    ${dataJson.lineas_ids == ''? '': `and tblproductos.StrLinea in('${dataJson.lineas_ids}')` } 
    ${dataJson.filtro_texto == ''? '': `and (tblproductos.StrDescripcion like '%${dataJson.filtro_texto}%' or tblproductos.StrIdProducto like '%${dataJson.filtro_texto}%')` }`;*/
    let sql = `
    select count(tabla3.StrIdProducto) as 'CantProductos' from(
        select * from(select
            tblproductos.StrIdProducto,TblProductos.StrDescripcion,
            cast(TblProductos.IntPrecio${dataJson.lista_precio} as int) as IntPrecio,
            convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
            convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
            convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
            ,StrParam3,strauxiliar as 'IntCantidadMedida',strunidad as 'StrUnidadMedida',
            TblImagenes.StrArchivo as 'StrRuta',
            tblproductos.IntHabilitarProd
            from tblproductos
            inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
            inner join TblProdParametro1 ON TblProdParametro1.stridpparametro1 = tblproductos.StrPParametro1
            inner join TblProdParametro2 ON TblProdParametro2.stridpparametro = tblproductos.StrPParametro2
            inner join TblProdParametro3 ON TblProdParametro3.stridpparametro = tblproductos.StrPParametro3
            where
            tblproductos.IntHabilitarProd in(1)
            ${dataJson.id_clase == '' ? '' : ` and tblproductos.StrClase = '${dataJson.id_clase}'`} 
            ${dataJson.lineas_ids == '' ?
            dataJson.strIdLineaActiva == 0 ? '' : `and tblproductos.StrLinea in('${dataJson.strIdLineaActiva}')`
            : `and tblproductos.StrLinea in('${dataJson.lineas_ids}')`} 
            ${dataJson.grupos_ids == '' ?
            dataJson.strIdGrupoActivo == 0 ? '' : `and tblproductos.StrGrupo in('${dataJson.strIdGrupoActivo}')`
            : `and tblproductos.StrGrupo in('${dataJson.grupos_ids}')`} 
            ${dataJson.tipos_ids == '' ?
            dataJson.strIdTipoActivo == 0 ? '' : `and tblproductos.StrTipo in('${dataJson.strIdTipoActivo}')`
            : `and tblproductos.StrTipo in('${dataJson.tipos_ids}')`} 
            ${dataJson.materiales_ids == '' ? '' : `and tblproductos.StrPParametro2 in('${dataJson.materiales_ids}')`} 
            ${dataJson.marcas_ids == '' ? '' : `and tblproductos.StrPParametro3 in('${dataJson.marcas_ids}')`} 
            ${dataJson.sexos_ids == '' ? '' : `and tblproductos.StrPParametro1 in('${dataJson.sexos_ids}')`}
            ${dataJson.filtro_texto == '' ? '' : `and (tblproductos.StrDescripcion like '%${dataJson.filtro_texto}%' or tblproductos.StrIdProducto like '%${dataJson.filtro_texto}%')`} 
         ) as tabla1
         union
         select * from (
            select top 10
            tblproductos.StrIdProducto,TblProductos.StrDescripcion,
            cast(TblProductos.IntPrecio${dataJson.lista_precio} as int) as IntPrecio,
            convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
            convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
            convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
            ,StrParam3,strauxiliar as 'IntCantidadMedida',strunidad as 'StrUnidadMedida',
            TblImagenes.StrArchivo as 'StrRuta',
            tblproductos.IntHabilitarProd
            from tblproductos
            inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
            inner join TblProdParametro1 ON TblProdParametro1.stridpparametro1 = tblproductos.StrPParametro1
            inner join TblProdParametro2 ON TblProdParametro2.stridpparametro = tblproductos.StrPParametro2
            inner join TblProdParametro3 ON TblProdParametro3.stridpparametro = tblproductos.StrPParametro3
            where
            tblproductos.IntHabilitarProd in(0)
            ${dataJson.id_clase == '' ? '' : ` and tblproductos.StrClase = '${dataJson.id_clase}'`} 
            ${dataJson.lineas_ids == '' ?
            dataJson.strIdLineaActiva == 0 ? '' : `and tblproductos.StrLinea in('${dataJson.strIdLineaActiva}')`
            : `and tblproductos.StrLinea in('${dataJson.lineas_ids}')`} 
            ${dataJson.grupos_ids == '' ?
            dataJson.strIdGrupoActivo == 0 ? '' : `and tblproductos.StrGrupo in('${dataJson.strIdGrupoActivo}')`
            : `and tblproductos.StrGrupo in('${dataJson.grupos_ids}')`} 
            ${dataJson.tipos_ids == '' ?
            dataJson.strIdTipoActivo == 0 ? '' : `and tblproductos.StrTipo in('${dataJson.strIdTipoActivo}')`
            : `and tblproductos.StrTipo in('${dataJson.tipos_ids}')`} 
            ${dataJson.materiales_ids == '' ? '' : `and tblproductos.StrPParametro2 in('${dataJson.materiales_ids}')`} 
            ${dataJson.marcas_ids == '' ? '' : `and tblproductos.StrPParametro3 in('${dataJson.marcas_ids}')`} 
            ${dataJson.sexos_ids == '' ? '' : `and tblproductos.StrPParametro1 in('${dataJson.sexos_ids}')`}
            ${dataJson.filtro_texto == '' ? '' : `and (tblproductos.StrDescripcion like '%${dataJson.filtro_texto}%' or tblproductos.StrIdProducto like '%${dataJson.filtro_texto}%')`} 
        ) as tabla2
    ) as tabla3
    `;
    try {
        let result = await SQLConexionHGI.execute(sql);
        return result.recordsets[0][0].CantProductos;
    } catch (error) {
        console.log("error")
    }
}

objSqlProductos.GetProductosPorReferncia = async (dataJson) => {
    //Conexion SQLserver
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    //Consulta sql productos
    let sql = `select TOP 10
    tblproductos.StrIdProducto,TblProductos.StrDescripcion,
    tblproductos.IntHabilitarProd,
    cast(TblProductos.IntPrecio${dataJson.lista_precio == 0 ? '1' : dataJson.lista_precio} as int) as IntPrecio,
    convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
    convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
    convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
    ,StrParam3,strauxiliar as 'IntCantidadMedida',strunidad as 'StrUnidadMedida',
    TblImagenes.StrArchivo as 'StrRuta'
    from tblproductos  
    inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 0
    inner join TblProdParametro1 ON TblProdParametro1.stridpparametro1 = tblproductos.StrPParametro1
    inner join TblProdParametro2 ON TblProdParametro2.stridpparametro = tblproductos.StrPParametro2
    inner join TblProdParametro3 ON TblProdParametro3.stridpparametro = tblproductos.StrPParametro3
    where 
    tblproductos.StrDescripcion like '%${dataJson.filtro_texto}%' or tblproductos.StrIdProducto like '%${dataJson.filtro_texto}%'
    ORDER BY tblproductos.StrIdProducto desc`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

objSqlProductos.GetProductosRelacionados = async (req) => {
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `
    select
    tblproductos.StrIdProducto,TblProductos.StrDescripcion,
    cast(TblProductos.IntPrecio${req.query.lista_precio} as int) as IntPrecio,
    convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
    convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
    convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
    ,StrParam3,strauxiliar as 'IntCantidadMedida',strunidad as 'StrUnidadMedida',
    TblImagenes.StrArchivo as 'StrRuta',
    tblproductos.IntHabilitarProd
    from tblproductos
    inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto and IntOrden = 1
    inner join TblProdParametro1 ON TblProdParametro1.stridpparametro1 = tblproductos.StrPParametro1
    inner join TblProdParametro2 ON TblProdParametro2.stridpparametro = tblproductos.StrPParametro2
    inner join TblProdParametro3 ON TblProdParametro3.stridpparametro = tblproductos.StrPParametro3
    where tblproductos.IntHabilitarProd in(1) and
    StrLinea in (select StrLinea from TblProductos where StrIdProducto in('`+ req.query.productos + `'))  
    and StrIdProducto not in ('`+ req.query.productos + `')`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}
//Obtiene las líneas de los productos según la clase, para generar los filtros
objSqlProductos.GetLineasPorClaseProducto = async (idClase) => {
    const SQLConexionHGI = new sqlCon();
    try {
        let result = await SQLConexionHGI.execute(`select distinct TblProductos.StrLinea as 'StrIdCategoria',TblLineas.StrDescripcion, 'Lineas' as 'StrTipoCategoria'
											from tblproductos inner join TblLineas on TblProductos.StrLinea=TblLineas.StrIdLinea  
											where tblproductos.StrClase='${idClase}';`);
        return result.recordset;
    } catch (error) {
        console.log("error hptaaaaaa")
    }
}

objSqlProductos.GetGrupos = async (idLinea, idClase) => {
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select distinct TblProductos.StrGrupo as 'StrIdCategoria',TblGrupos.StrDescripcion, 'Grupos' as 'StrTipoCategoria'
		from tblproductos inner join TblGrupos on TblProductos.StrGrupo=TblGrupos.StrIdGrupo
		where tblproductos.StrClase='${idClase}' and tblproductos.StrLinea='${idLinea}' and TblProductos.StrGrupo != 0;`;
    let result = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return result.recordsets[0];
}

objSqlProductos.GetTipos = async (idLinea, idClase, idGrupo) => {
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select distinct TblProductos.StrTipo as 'StrIdCategoria',TblTipos.StrDescripcion, 'Tipos' as 'StrTipoCategoria'
		from tblproductos inner join TblTipos on TblProductos.StrTipo=TblTipos.StrIdTipo
		where tblproductos.StrClase='${idClase}' and tblproductos.StrLinea='${idLinea}' 
		and tblproductos.StrGrupo='${idGrupo}' and TblProductos.StrTipo != 0;`;
    let result = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return result.recordsets[0];
}

objSqlProductos.GetProductoEspecifico = async (idProducto) => {
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let result = await SQLConexionHGI.query(`select 
							tblproductos.StrIdProducto,TblProductos.StrDescripcion,convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
							convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
							convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
							from tblproductos where TblProductos.StrIdProducto='${idProducto}';`);
    await SQLConexionHGI.close();
    return result.recordsets[0];
}

module.exports = objSqlProductos;