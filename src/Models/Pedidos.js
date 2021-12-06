const databaseSQL = require(`../Databases/databaseSQL.js`);
const objSqlPedidos = {};
//Envio del pedido a la tabla tblpedidos (general)
objSqlPedidos.EnviarPedidoDash = async (strJsonPedido) => {

    const {strIdCliente, strNombCliente, strCiudadCliente, intValorTotal, strObservacion, strIdDependencia, strNombreDependencia} = strJsonPedido;
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    let sql = "select max(intIdPedido) as intIdPedido from dash.tblpedidos";
    const [rpta]  = await SQLConexionDASH.execute(sql);
    const [rows, fields]  = await SQLConexionDASH.execute("insert into dash.tblpedidos (`intIdPedido`,`strIdPedidoVendedor`, `strIdVendedor`,`strNombVendedor`, `strIdCliente`,\
                        `strNombCliente`,`strCiudadCliente`, `intValorTotal`, `dtFechaFinalizacion`, `dtFechaModificacion`,`dtFechaEnvio`, `intTipo`,`intTipoPedido`,\
                        `intCompania`,`strObservacion`,`strCorreoClienteAct`,`strTelefonoClienteAct`,`strCelularClienteAct`,`strCiudadClienteAct`,`strIdDependencia`,\
                        `strNombreDependencia`,`blEspera`,`intEstado`) VALUES("+(rpta[0].intIdPedido+1)+",?,?,?,?,?,?,?,NOW(),NOW(),NOW(),?,?,?,?,?,?,?,?,?,?,?,0);",
    [0, '1111', 'Test Vendedor Web', strIdCliente, strNombCliente, strCiudadCliente, intValorTotal, 0, 5, 1, strObservacion, 'email', 'tel', 'cel', 'ciudad', strIdDependencia, strNombreDependencia, 0]);
    await SQLConexionDASH.close();
    rows.intIdPedido = (rpta[0].intIdPedido+1);
    /*const rows = {
        serverStatus: 2,
        intIdPedido: 6025
    }*/
    return rows;
}

objSqlPedidos.EnviarDetallePedidoDash = async (strJsonDetalle, intIdPedido) => {
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    await strJsonDetalle.forEach(async item => {
        if(item.strEstilos.length != 0){
            item.strEstilos.forEach(async estilo =>{
                await SQLConexionDASH.query("CALL SP_GuardarDetallePedido(?,?,?,?,?, ?,?,?,?,?)",
                [intIdPedido, item.strReferencia, item.strDescripcion,estilo.strCantidad,'und test',item.strObservacion, item.strPrecioUnidad, item.strPrecioTotal, "talla test",estilo.strNumFoto])
                .then(([rpta,fields]) => {
                    //console.log(rpta);
                })
                .catch(console.log); 
            })
        }else{
            await SQLConexionDASH.query("CALL SP_GuardarDetallePedido(?,?,?,?,?, ?,?,?,?,?)",
            [intIdPedido, item.strReferencia, item.strDescripcion,item.strCantidadTotal,'und test',item.strObservacion, item.strPrecioUnidad, item.strPrecioTotal, "talla test",""])
            .then(([rpta,fields]) => {
                //console.log(rpta);
            })
            .catch(console.log); 
        }
    });
}

//Envio del pedido al vendedor asociado
objSqlPedidos.EnviarPedidoLocalDash = async (strJsonPedido) => {

    const {strIdCliente, strNombCliente, intlistaPrecio, strCiudadCliente, intValorTotal, strObservacion, strIdDependencia, strNombreDependencia, jsonVendedor} = strJsonPedido;
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    let sql = "SELECT max(intId) as intId FROM tblpedidocliente";
    const [rpta]  = await SQLConexionDASH.execute(sql);
    //jsonVendedor.idLogin = 87;
    const [rows, fields]  = await SQLConexionDASH.execute("INSERT INTO dash.tblpedidocliente(`intId`,`strIdUsuario`, `strIdTercero`, `intlistaPrecio`, `fechaini` , \
    `fechafin`, `intTipoTercero` , `strCiudad`, `strNombreTercero`, `intEstado`, `strObservacion`, `strDependencia`, `intIdDependencia`, `strIdVendedor`)\
    VALUES (?,?,?,?,NOW(),NOW(),?, ?, ?, 0,?,?,?,?);",
    [rpta[0].intId+1, jsonVendedor.idLogin, strIdCliente, intlistaPrecio, intlistaPrecio, strCiudadCliente, strNombCliente, strObservacion, strNombreDependencia, strIdDependencia, jsonVendedor.strCedula]);
    await SQLConexionDASH.close();
    rows.intIdPedido = rpta[0].intId+1;
    return rows;
}

objSqlPedidos.EnviarDetallePedidoLocalDash = async (strJsonDetalle, intIdPedido, blDescuento, blDescuento2) => {
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    await strJsonDetalle.forEach(async item => {
        if(item.StrEstilos.length != 0){
            item.StrEstilos.forEach(async estilo =>{
                const IntPrecio = blDescuento || blDescuento2 ? item.IntPrecio2 : item.IntPrecio;
                await SQLConexionDASH.query("CALL SP_AgregarDetallePedidoCliente(?,?,?,?,?,?,?,?,?)",
                [intIdPedido, item.StrObervaciones, item.StrIdProducto, estilo.strCantidad, IntPrecio, (IntPrecio * estilo.strCantidad), estilo.strNumFoto, item.StrDescripcion,'und test'])
                .then(([rpta,fields]) => {
                    //console.log(rpta);
                })
                .catch(console.log); 
            })
        }else{
            const IntPrecio = blDescuento || blDescuento2 ? item.IntPrecio2 : item.IntPrecio;
            await SQLConexionDASH.query("CALL SP_AgregarDetallePedidoCliente(?,?,?,?,?,?,?,?,?)",
            [intIdPedido, item.StrObervaciones, item.StrIdProducto, item.IntCantidad, IntPrecio, (IntPrecio * item.IntCantidad), '', item.StrDescripcion,'und test'])
            .then(([rpta,fields]) => {
                //console.log(rpta);
            })
            .catch(e=>{console.log(e)});
        }
    });
}

objSqlPedidos.ActualizarDetallePedido = async (strJsonDetalle) => {
    const {StrIdProducto, StrUnidadMedida, IntPrecio, StrDescripcion, IntValorTotal, IntCantidad, IntIdPedido} = strJsonDetalle;
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    await SQLConexionDASH.query("CALL SP_AgregarDetallePedidoCliente(?,?,?,?,?,?,?,?,?)",
    [IntIdPedido, '', StrIdProducto, IntCantidad, IntPrecio, IntValorTotal, '0', StrDescripcion, StrUnidadMedida])
    .then(([rpta,fields]) => {
        return rpta;
    })
    .catch(console.log); 
}

module.exports = objSqlPedidos;