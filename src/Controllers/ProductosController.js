const objProductos = {};
const databaseSQL = require("../Databases/databaseSQL.js");
const objSqlProductos = require("../Models/Productos");
const objSqlProducto = require("../Models/Productos");
const objSqlTercero = require("../Models/Usuarios");

//Obtener los productos por clase(Categoria)
objProductos.GetProductosPorCategoria = async (req, res) => {
  try {
    const JsonProductos = [];
    let resultProductos = await objSqlProducto.GetProductosPorCategoria(
      req.query
    );
    //Consulta imagenes
    let resultImagenes = await objSqlProducto.GetImagenesProductos(req.query);
    //Organizando informacion
    //Data productos categoria
    resultProductos.forEach((strData, intIndex) => {
      JsonProductos.push(strData);
      JsonProductos[intIndex].strImages = [];
      //Imagenes
      resultImagenes.forEach((strDataImage) => {
        if (strData.StrIdProducto == strDataImage.StrIdCodigo) {
          JsonProductos[intIndex].strImages.push(strDataImage);
        }
      });
    });
    //Determinar tipo de consulta de productos por categoria 1=Consulta inicial de la categoria para obtener la información inicial para la pagina
    if (req.query.num_paginacion == "1") {
      res.json({
        success: true,
        strProductos: JsonProductos,
        strNumProductos: await objSqlProducto.GetCantProductosClase(req.query),
      });
    } else {
      res.json({
        success: true,
        strProductos: JsonProductos,
      });
    }
  } catch (e) {
    console.log("error get productos por categoria general!!!");
    console.log(e);
    console.log("---------------");
    res.json({
      success: false,
      strMensaje: e,
    });
  }
};

objProductos.GetProductosPorReferncia = async (req, res) => {
  let listaPrecio = await objSqlTercero.GetTercero(req.query.strIdTercero);
  if (listaPrecio !== undefined) {
    req.query.lista_precio = listaPrecio.intprecio;
    let resultProductos = await objSqlProducto.GetProductosPorReferncia(
      req.query
    );
    res.json({
      success: true,
      strProductos: resultProductos,
    });
  } else {
    /*res.json({ 
			success: false,
			strMensaje: 'Tercero no creado' 
		});*/
    req.query.lista_precio = 3;
    let resultProductos = await objSqlProducto.GetProductosPorReferncia(
      req.query
    );
    res.json({
      success: true,
      strProductos: resultProductos,
    });
  }
};

//Obtener Lineas de los productos segun su clase
objProductos.GetLineasPorClaseProducto = async (req, res) => {
  try {
    /*const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
		let result = await SQLConexionHGI.query(`select distinct TblProductos.StrLinea as 'StrIdCategoria',TblLineas.StrDescripcion, 'Lineas' as 'StrTipoCategoria'
											from tblproductos inner join TblLineas on TblProductos.StrLinea=TblLineas.StrIdLinea  
											where tblproductos.StrClase='${req.params.id_clase}' ;`);
		res.json({
			strDataCategoria: result.recordsets[0]
		});
		//Cerrar conexion SQL
		await SQLConexionHGI.close();
		return result.recordsets[0];*/
    let result = await objSqlProductos.GetLineasPorClaseProducto(
      req.params.id_clase
    );
    res.json({
      strDataCategoria: result,
    });
  } catch (e) {
    res.json({ error: 0, e });
    console.log(e);
  }
};

//Obtener grupos de los productos segun su clase y linea
objProductos.GetGrupos = async (req, res) => {
  try {
    /*//Conexion SQLserver
		const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
		let sql = `select distinct TblProductos.StrGrupo as 'StrIdCategoria',TblGrupos.StrDescripcion, 'Grupos' as 'StrTipoCategoria'
		from tblproductos inner join TblGrupos on TblProductos.StrGrupo=TblGrupos.StrIdGrupo
		where tblproductos.StrClase='${req.params.id_clase}' and tblproductos.StrLinea='${req.params.id_linea}' and TblProductos.StrGrupo != 0;`;
		console.log(sql);
		let result = await SQLConexionHGI.query(sql);
		res.json({
			strDataCategoria: result.recordsets[0]
		});
		//Cerrar conexion SQL
		await SQLConexionHGI.close();
		return result.recordsets[0];*/
    let result = await objSqlProductos.GetGrupos(
      req.params.id_linea,
      req.params.id_clase
    );
    res.json({
      strDataCategoria: result,
    });
  } catch (e) {
    res.json({ error: 0, e });
    console.log(e);
  }
};

//Obtener tipos de los productos segun su clase, linea y tipo
objProductos.GetTipos = async (req, res) => {
  try {
    /*//Conexion SQLserver
		const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
		let sql = `select distinct TblProductos.StrTipo as 'StrIdCategoria',TblTipos.StrDescripcion, 'Tipos' as 'StrTipoCategoria'
		from tblproductos inner join TblTipos on TblProductos.StrTipo=TblTipos.StrIdTipo
		where tblproductos.StrClase='${req.params.id_clase}' and tblproductos.StrLinea='${req.params.id_linea}' 
		and tblproductos.StrGrupo='${req.params.id_grupo}' and TblProductos.StrTipo != 0;`;
		console.log(sql);
		let result = await SQLConexionHGI.query(sql);
		res.json({
			strDataCategoria: result.recordsets[0]
		});
		//Cerrar conexion SQL
		await SQLConexionHGI.close();
		return result.recordsets[0];*/
    let result = await objSqlProductos.GetTipos(
      req.params.id_linea,
      req.params.id_clase,
      req.params.id_grupo
    );
    res.json({
      strDataCategoria: result,
    });
  } catch (e) {
    res.json({ error: 0, e });
    console.log(e);
  }
};

//Obtener producto especifico
objProductos.GetProductoEspecifico = async (req, res) => {
  try {
    /*//Conexion SQLserver
		const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
		let result = await SQLConexionHGI.query(`select 
							tblproductos.StrIdProducto,TblProductos.StrDescripcion,convert(int,TblProductos.IntPrecio1) as 'IntPrecio1',
							convert(int,TblProductos.IntPrecio2) as 'IntPrecio2',convert(int,TblProductos.IntPrecio3) as 'IntPrecio3',
							convert(int,TblProductos.IntPrecio4) as 'IntPrecio4',convert(int,TblProductos.IntPrecio5) as 'IntPrecio5'
							from tblproductos where TblProductos.StrIdProducto='${req.params.id_producto}';`);
		res.json({
			strProducto: result.recordsets[0]
		});
		//Cerrar conexion SQL
		await SQLConexionHGI.close();*/
    let result = await objSqlProductos.GetProductoEspecifico(
      req.params.id_linea,
      req.params.id_clase,
      req.params.id_grupo
    );
    res.json({
      strDataCategoria: result,
    });
  } catch (e) {
    console.log(e);
    res.json({ error: 0, e });
  }
};

//Obtener productos relacionados
objProductos.GetProductosRelacionados = async (req, res) => {
  try {
    const JsonProductos = [];
    const resultProductos = await objSqlProducto.GetProductosRelacionados(req);
    await GetProductosRelacionados.close();
    const resultImagenes = await objSqlProducto.GetImagenesProductos(req.query);
    await GetImagenesProductos.close();
    resultProductos.forEach((strData, intIndex) => {
      JsonProductos.push(strData);
      JsonProductos[intIndex].strImages = [];
      //Imagenes
      resultImagenes.forEach((strDataImage) => {
        if (strData.StrIdProducto == strDataImage.StrIdCodigo) {
          JsonProductos[intIndex].strImages.push(strDataImage);
        }
      });
    });
    res.json({
      success: true,
      strProductos: JsonProductos,
    });
  } catch (e) {
    res.json({
      success: false,
      strMensaje: e,
    });
  }
};
module.exports = objProductos;
