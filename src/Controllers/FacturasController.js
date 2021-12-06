const objFacturas = {};
const databaseSQL = require('../Databases/databaseSQL.js');
const model = require('../Models/Facturas');

//Obtener los productos por clase(Categoria)
objFacturas.GetFacturasPorTercero = async (req, res) => {
	try {
		const JsonFacturas = [];

		const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
        //Consultar Pedidos asociadas al tercero
		const [rows, fields]  = await SQLConexionDASH.execute('select intEstado as "StrEstado",0 as "intTipoPedido", intIdPedido as "IntDocumento" , intIdPedido as "IntDocRef", intValorTotal as "IntTotal", dtFechaFinalizacion as "DatFecha",  0 as "IntCartera"  from tblpedidos where strIdCliente = ? and intEstado != 0', [req.params.id_tercero]);
		
		rows.forEach((strData, intIndex) => {
			JsonFacturas.push(strData);
		});
		await SQLConexionDASH.close();

		//Conexion SQLserver
        const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
        //Consultar Facturas asociadas al tercero
		let sql  = `
		select  6 as 'StrEstado',1 as 'intTipoPedido', FORMAT(DatFecha, 'yyyy-MM-dd') as 'DatFecha',TblDocumentos.IntDocumento,TblDocumentos.IntDocRef,TblDocumentos.IntTotal, 0 as 'IntCartera'  
		from TblDocumentos
		where TblDocumentos.StrTercero = '${req.params.id_tercero}' and TblDocumentos.IntTransaccion = 47 and IntDocumento not in (
			select Cartera.IntDocumento from Cartera where StrIdTercero = '${req.params.id_tercero}'
		)
		union all
		select 6 as 'StrEstado',1 as 'intTipoPedido', FORMAT(DatFecha, 'yyyy-MM-dd') as 'DatFecha',Cartera.IntDocumento,Cartera.IntDocRef,Cartera.IntTotal, Cartera.IntSaldoF as 'IntCartera'  
		from Cartera where StrIdTercero = '${req.params.id_tercero}';`;
		let resultFacturas = await SQLConexionHGI.query(sql);
        console.log(sql)
		resultFacturas = resultFacturas['recordset'];


		//Organizando informacion
		resultFacturas.forEach((strData, intIndex) => {
			JsonFacturas.push(strData);
		});


		//Cerrar conexion SQL
		await SQLConexionHGI.close();

		
		res.json({
            strFacturas: JsonFacturas
        });
	} catch (e) {
		res.json({ e });
	}
}

//Obtener los productos por clase(Categoria)
objFacturas.GetDetallePorFactura = async (req, res) => {
	try {
		//Calculando paginacion
		let intInicioPaginacion = 30;
		const JsonDetalle = [];


		if(req.params.tipo_pedido == 1){
			//Conexion SQLserver
			const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
			//Consultar Facturas asociadas al tercero
			let sql = `select StrProducto, IntValorTotal, TblProductos.StrDescripcion, TblDetalleDocumentos.IntCantidad, TblDetalleDocumentos.StrUnidad, TblImagenes.* from TblDetalleDocumentos
			inner join TblProductos on TblDetalleDocumentos.StrProducto = TblProductos.StrIdProducto 
			inner join TblImagenes on TblImagenes.StrIdCodigo = TblProductos.StrIdProducto 
			where IntDocumento = '${req.params.id_factura}'`;
			let resultDocumeno = await SQLConexionHGI.query(sql);
			console.log(sql);
			resultDocumeno = resultDocumeno['recordset'];


			//Organizando informacion
			resultDocumeno.forEach((strData, intIndex) => {
				JsonDetalle.push(strData);
			});


			//Cerrar conexion SQL
			await SQLConexionHGI.close();
		}else{
			const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
			//Consultar Pedidos asociadas al tercero
			const [rows, fields]  = await SQLConexionDASH.execute('select strIdProducto as "StrProducto",strDescripcion as "StrDescripcion", strUnidadMedida as "StrUnidad", intPrecioProducto as "IntValorTotal" from dash.tbldetallepedidos where intIdPedido = ?', [req.params.id_factura]);
			
			rows.forEach((strData, intIndex) => {
				JsonDetalle.push(strData);
			});
			await SQLConexionDASH.close();
		}



		
		res.json({
            strDetalle: JsonDetalle
        });
	} catch (e) {
		res.json({ e });
	}
}

objFacturas.DescargarFactura = async (req, res)=>{
	try {
		const rptaHgi = await model.GetFacturaTercero({
			intIdPedido:req.params.int_documento,
			strIdTercero: req.params.id_tercero
		});
		if(rptaHgi){
			const detalle = await model.GetDetalleFacturaTercero({
				intIdPedido:req.params.int_documento
			});
			let json = {};
			json.encabezado = rptaHgi[0];
			json.detalle = detalle;
			const {CreatePdf} = require('../Services/pdf');
			CreatePdf(json.encabezado.StrIdTercero,json)
			.then(rpta => {
				res.sendFile(rpta.filename);
			})
			.catch(err => {
				console.log(err);
			});
		}else{
			res.json({
				Success: false, strMensaje: "Hubo un error" 
			});
		}
	} catch (error) {
		console.log(error);
		res.status(404).send("Not found.");
	}
	
	//res.sendFile('../Services/pdf/documents/');
}
objFacturas.DuplicarFactura = async(req, res)=>{
	try {
		await model.DuplicarFactura(req.body);
		res.json({
			Success:true,
			strMensaje : "Pedido duplicado con éxito!"
		})
	} catch (error) {
		res.json({
			Success:false,
			strMensaje : error
		})
	}
}
module.exports = objFacturas;
