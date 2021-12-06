const objSqlUsuarios = {};
const databaseSQL = require("../Databases/databaseSQL.js");
const sqlCon = require("../Databases/DbHgi.js");

objSqlUsuarios.UpdateTerceroGeneral = async (jsonTercero) => {
  try {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    const {
      documento,
      PNombre,
      SNombre,
      PApellido,
      SApellido,
      razonSocial,
      telefono,
      direccion,
      tipoTercero,
      emailFact,
    } = jsonTercero;
    let sql = "";
    if (tipoTercero == 2) {
      sql = `
            ALTER TABLE tblterceros DISABLE TRIGGER ALL;
            update TblTerceros set 
            StrNombre = '${razonSocial.val}',
            StrApellido1 = '${razonSocial.val}',
            StrNombreComercial = '${razonSocial.val}',
            StrTelefono = '${telefono.val}',
            StrDireccion = '${direccion.val}',
            StrMailFE = '${emailFact.val}',
            strMail = '${emailFact.val}'
            where StrIdTercero = '${documento.val}'
            ALTER TABLE tblterceros ENABLE TRIGGER ALL;`;
    } else {
      sql = `
            ALTER TABLE tblterceros DISABLE TRIGGER ALL;
            update TblTerceros set 
            StrNombre = '${PNombre.val} ${SNombre.val} ${PApellido.val} ${SApellido.val}',
            StrNombre1 = '${PNombre.val}',
            StrNombre2 = '${SNombre.val}',
            StrApellido1 = '${PApellido.val}',
            StrApellido2 = '${SApellido.val}',
            StrTelefono = '${telefono.val}',
            StrDireccion = '${direccion.val}',
            StrMailFE = '${emailFact.val}',
            strMail = '${emailFact.val}'
            where StrIdTercero = '${documento.val}'
            ALTER TABLE tblterceros ENABLE TRIGGER ALL;`;
    }
    let resultTercero = await ConexionSQL_HGI.query(sql);
    resultTercero = resultTercero["recordset"];
    await ConexionSQL_HGI.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

objSqlUsuarios.UpdateTerceroTributaria = async (jsonTercero) => {
  try {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    const {
      regimenVentas,
      regimenFiscal,
      resp05,
      resp07,
      resp09,
      resp35,
      intGranContribuyente,
      intAutoRetenedor,
      intRetenedorIca,
      intManejaBasesReteIva,
      manejaBasesReteFte,
      intContratoEstabilidad,
      documento,
    } = jsonTercero;
    let sql = `
        ALTER TABLE tblterceros DISABLE TRIGGER ALL;
        update TblTerceros set 
        IntRegimen = '${regimenVentas}',
        IntRegimenFiscal = '${regimenFiscal}',
        IntResp05 = '${resp05}',
        IntResp07 = '${resp07}',
        IntResp09 = '${resp09}',
        IntResp35 = '${resp35}',
        IntGranContribuyente = '${intGranContribuyente}',
        IntAutoRetenedor = '${intAutoRetenedor}',
        IntRetenedorIca = '${intRetenedorIca}',
        IntNoManejaBasesReteIva = '${intManejaBasesReteIva}',
        IntNoManejaBases = '${manejaBasesReteFte}',
        IntContratoEstabilidad = '${intContratoEstabilidad}'
        where StrIdTercero = '${documento}'
        ALTER TABLE tblterceros ENABLE TRIGGER ALL;`;
    let resultTercero = await ConexionSQL_HGI.query(sql);
    resultTercero = resultTercero["recordset"];
    await ConexionSQL_HGI.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

objSqlUsuarios.GetDependencia = async (strIdTercero) => {
  const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
  try {
    let sql = `Select TblVinculados.*,TblCiudades.StrIdCiudad as 'StrCiudad', TblCiudades.StrDescripcion as 'StrDescripcionCiudad', TblZonas.StrIdZona as 'StrIdDepartamento', TblZonas.StrDescripcion as 'StrDepartamento' 
        from TblVinculados 
        inner join TblCiudades on TblVinculados.StrZona = TblCiudades.StrIdCiudad 
        inner join TblZonas on TblZonas.StrIdZona = TblCiudades.StrZona
        where StrTercero = '${strIdTercero}'  and IntIdVinculado != 0 order by IntIdVinculado desc`;
    console.log(sql);
    let resultDependencias = await ConexionSQL_HGI.query(sql);
    console.log(resultDependencias);
    resultDependencias = resultDependencias["recordset"];
    await ConexionSQL_HGI.close();
    return resultDependencias;
  } catch (error) {
    console.log(error);
    await ConexionSQL_HGI.close();
    return false;
  }
};

objSqlUsuarios.UpdateDependencia = async (jsonTercero) => {
  try {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    const {
      nombresSucursal,
      telefonoSucursal,
      CiudadEntrega,
      direccionEntrega,
      emailSucursal,
      documento,
      idVinculado,
    } = jsonTercero;
    let sql = `
        ALTER TABLE TblVinculados DISABLE TRIGGER ALL;
        UPDATE TblVinculados SET
        StrNombre = '${nombresSucursal.val}',
        StrDireccion = '${direccionEntrega.val}',
        StrZona = '${CiudadEntrega.val}',
        StrMail = '${emailSucursal.val}',
        StrTelefono = '${telefonoSucursal.val}'
        where TblVinculados.StrTercero = '${documento}' AND TblVinculados.IntIdVinculado = '${idVinculado}'
        ALTER TABLE TblVinculados ENABLE TRIGGER ALL;`;
    let resultDependencias = await ConexionSQL_HGI.query(sql);
    console.log(resultDependencias);
    await ConexionSQL_HGI.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

objSqlUsuarios.NewDependencia = async (jsonTercero) => {
  try {
    //const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    const {
      documento,
      nombresSucursal,
      direccionEntrega,
      CiudadEntrega,
      DepartamentoEntrega,
      telefonoSucursal,
      emailSucursal,
    } = jsonTercero;
    let sql = `
        ALTER TABLE TblVinculados DISABLE TRIGGER ALL;
        INSERT INTO [dbo].[TblVinculados]
            ([StrTercero]
            ,[IntIdVinculado]
            ,[StrNombre]
            ,[StrDireccion]
            ,[StrZona]
            ,[StrSector]
            ,[StrBarrio]
            ,[StrTelefono]
            ,[StrVendedor]
            ,[IntTipoTercero]
            ,[IntCupo]
            ,[StrMail])
        VALUES
           ('${documento}'
           ,(select ISNULL((max(IntIdVinculado) + 1), 1) from TblVinculados where StrTercero = '${documento}')
           ,'${nombresSucursal.val}'
           ,'${direccionEntrega.val}'
           ,'${CiudadEntrega.val}'
           ,'0'
           ,'0'
           ,'${telefonoSucursal.val}'
           ,'0'
           ,'02'
           ,0
           ,'${emailSucursal.val}');
        ALTER TABLE TblVinculados ENABLE TRIGGER ALL;`;
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    let resultDependencias = await ConexionSQL_HGI.query(sql);
    console.log(sql);
    resultDependencias = resultDependencias["recordset"];
    await ConexionSQL_HGI.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

objSqlUsuarios.ValidarCompras = async (strIdTercero, intPrecio) => {
  try {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    let sql = "";
    if (intPrecio == 3) {
      sql = `select IntTotal from TblDocumentos where IntTransaccion = 47 and StrTercero = '${strIdTercero}' and IntTotal > 500000 and IntTotal < 1000000`; //1013591967 precio original 2
    } else if (intPrecio == 2) {
      sql = `select IntTotal from TblDocumentos where IntTransaccion = 47 and StrTercero = '${strIdTercero}' and IntTotal >= 1000000`;
    }
    let resutlCompras = await ConexionSQL_HGI.query(sql);
    resutlCompras = resutlCompras["recordset"];
    await ConexionSQL_HGI.close();
    return resutlCompras;
  } catch (error) {
    console.log(error);
    return false;
  }
};

objSqlUsuarios.UpdateListaPrecio = async (strIdTercero, precio) => {
  try {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `
        ALTER TABLE tblterceros DISABLE TRIGGER ALL;
        update TblTerceros
        set inttipotercero = '${precio}'
        where StrIdTercero = '${strIdTercero}'
        ALTER TABLE tblterceros ENABLE TRIGGER ALL;`;
    let result = await ConexionSQL_HGI.query(sql);
    result = result["rowsAffected"];
    await ConexionSQL_HGI.close();
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//confirmar el insert con el registro en la pagina!!!!!!
objSqlUsuarios.CrearCompradorEcommerce = async ({
  StrNombre,
  StrApellido,
  StrCiudad,
  StrIdTercero,
  StrDireccion,
  IntTelefono,
  StrEmail,
  StrTipoId,
}) => {
  const sql =
    `ALTER TABLE TblEcommerceComprador DISABLE TRIGGER ALL;
        INSERT INTO TblEcommerceComprador
        ([StrTipoId]
        ,[IntIdentificacion]
        ,[StrNombres]
        ,[StrApellidos]
        ,[StrTelefono]
        ,[StrMail]
        ,[StrDireccion]
        ,[StrCodPostal]
        ,[StrCiudad]
        ,[DatFecha]
        ,[StrClave]
        ,[StrCodClave]
        ,[BitValidadoMail]
        ,[BitValidadoTercero])
        VALUES
            ('` +
    StrTipoId +
    `'
            ,'` +
    StrIdTercero +
    `'
            ,'` +
    StrNombre +
    `'
            ,'` +
    StrApellido +
    `'
            ,'` +
    IntTelefono +
    `'
            ,'` +
    StrEmail +
    `'
            ,'` +
    StrDireccion +
    `'
            ,'123'
            ,'` +
    StrCiudad +
    `'
            ,GETDATE()
            ,''
            ,''
            ,0
            ,0)`;

  let SQLConexionHGI = new sqlCon();
  try {
    console.log(sql);
    let rpta = await SQLConexionHGI.execute(sql);
    return rpta.recordset;
  } catch (error) {
    console.log("--------- ");
    console.log(error);
    return false;
  } finally {
    SQLConexionHGI.close();
  }
};

//--------------------------------------MODULO DEL DASH-------------------------------------------

module.exports = objSqlUsuarios;
