const objSqlUsuarios = {};
const databaseSQL = require('../Databases/databaseSQL.js');

objSqlUsuarios.GetUsuario = async (email, pass = null) => {
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    let rows = [];
    if (pass == null) {
        [rows] = await SQLConexionDASH.execute("select * from tblusuariosweb where strEmail = ?;", [email]);
    } else {
        [rows] = await SQLConexionDASH.execute("select * from tblusuariosweb where strEmail = ? and strContrasena = ?;", [email, pass]);
    }
    await SQLConexionDASH.close();
    return rows;
}

objSqlUsuarios.CrearUsuario = async (strJsonTercero) => {
    const { email, pass, names, documento, TipoFormulario, razonSocial = "", checkInfoEmail } = strJsonTercero;
    /**/
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    const [rows, fields] = await SQLConexionDASH.execute("insert into tblusuariosweb (`strEmail`, `strContrasena`, `strNombre`, `strApellido`,`dtFecha`,`strIdTercero`) values(?,?,?,?,NOW(),?);",
        [email, pass, names, checkInfoEmail.toString(), documento]);
    await SQLConexionDASH.close();
    console.log(rows);
    return rows[0];
}

objSqlUsuarios.GetTercero = async (strIdTercero) => {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    let resultTercero = await ConexionSQL_HGI.query(`select TblTerceros.*, tbltipostercero.intprecio, TblCiudades.StrDescripcion as StrCiudadDescripcion from TblTerceros 
                                                        inner join tbltipostercero ON TblTerceros.inttipotercero = tbltipostercero.intidtipotercero 
                                                        inner join TblCiudades ON TblTerceros.strCiudad = TblCiudades.StrIdCiudad
                                                        where StrIdTercero = '${strIdTercero}'`);
    resultTercero = resultTercero['recordset'];
    await ConexionSQL_HGI.close();
    return resultTercero[0];
}

objSqlUsuarios.GetTerceroEmailId = async (strEmail, strIdTercero) => {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select TblTerceros.*, tbltipostercero.intprecio, TblCiudades.StrDescripcion as StrCiudadDescripcion from TblTerceros 
    inner join tbltipostercero ON TblTerceros.inttipotercero = tbltipostercero.intidtipotercero 
    inner join TblCiudades ON TblTerceros.strCiudad = TblCiudades.StrIdCiudad
    where StrIdTercero = '${strIdTercero}' and (StrMailFE = '${strEmail}' or StrMail = '${strEmail}')`;
    console.log(sql)
    let resultTercero = await ConexionSQL_HGI.query(sql);
    resultTercero = resultTercero['recordset'];
    await ConexionSQL_HGI.close();
    return resultTercero[0];
}

objSqlUsuarios.GetCodCiudad = async (strDescripcion) => {
    const ConexionSQL_HGI = await databaseSQL.ConexionSQL_HGI();
    console.log(`select StrIdCiudad from TblCiudades where StrDescripcion = '${strDescripcion}'`);
    let resultCiudad = await ConexionSQL_HGI.query(`select StrIdCiudad from TblCiudades where StrDescripcion = '${strDescripcion}'`);
    resultCiudad = resultCiudad['recordset'];
    await ConexionSQL_HGI.close();
    return resultCiudad[0];
}

objSqlUsuarios.CrearTerceroSqlParcial = async (strJsonTercero) => {
    //Validar si existe el cliente si existe no crear el cliente en el HGI
    let strTercero = await objSqlUsuarios.GetTercero(strJsonTercero.documento.val);
    let res = {
        status: 0,
        data: ''
    }
    if (strTercero != undefined) {
        res.status = 1;
        return res; //Error ya existe el tercero registrado
    }
    if (strJsonTercero.TipoFormulario == 0) {
        const {
            nombres,
            apellidos,
            tipoDoc,
            documento,
            direccion,
            emailFacturacion,
            ciudad,
            telefono
        } = strJsonTercero;

        let tipoDocumento = tipoDoc.val.split("-");
        const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
        await SQLConexionHGI.query(`
            ALTER TABLE tblterceros DISABLE TRIGGER ALL;
            INSERT INTO [dbo].[TblTerceros]
                (StrIdTercero,StrNombre,StrTipoId,StrApellido1,StrApellido2,
                StrNombre1,StrNombre2,StrNombreComercial,StrDireccion,StrDireccion2,
                StrCodPostal,StrTelefono,StrCelular,IntTipoTercero,StrCiudad,
                StrActividadEco,IntTipoPersona,IntRegimen,IntRegimenFiscal,
                IntResp05,IntResp07,IntResp09,IntResp35,IntAutoRetenedor,IntGranContribuyente,
                strMail,StrMailFE,IntTEstado,DatFechaIngreso,DatFechaUNegocio,DatFechaRetiro,DatFechaAct
                ,IntTipoCuenta,StrEntidad,StrCausaRetiro)
            VALUES
                (
                '${documento.val}','${nombres.val + ' ' + apellidos.val}','${tipoDocumento[0]}','${apellidos.val}','${apellidos.val}',
                '${nombres.val}','${nombres.val}','','${direccion.val}','${direccion.val}',
                '${ciudad.val}','${telefono.val}','${telefono.val}','03','${ciudad.val}','01',
                1,1,1,0,0,0,0,0,0,'${emailFacturacion.val}','${emailFacturacion.val}',1,GETDATE(),
                GETDATE(),GETDATE(),GETDATE(),1,0,0
                );
            ALTER TABLE tblterceros ENABLE TRIGGER ALL;
        `);
        await SQLConexionHGI.close();
    } else {
        try {
            const {
                razonSocial,
                nit,
                direccion,
                emailFacturacion,
                ciudad,
                telefono
            } = strJsonTercero;
            const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
            await SQLConexionHGI.query(`
                ALTER TABLE tblterceros DISABLE TRIGGER ALL;
                INSERT INTO [dbo].[TblTerceros]
                       (StrIdTercero,StrNombre,StrTipoId,StrApellido1,
                       StrNombreComercial,StrDireccion,StrDireccion2,
                       StrCodPostal,StrTelefono,StrCelular,IntTipoTercero,StrCiudad,
                       StrActividadEco,IntTipoPersona,
                       strMail,StrMailFE,IntTEstado,DatFechaIngreso,DatFechaUNegocio,DatFechaRetiro,DatFechaAct
                       ,IntTipoCuenta,StrEntidad,StrCausaRetiro)
                 VALUES
                     (
                        '${nit.val}','${razonSocial.val}','NI','${razonSocial.val}','${razonSocial.val}','${direccion.val}','${direccion.val}',
                        '${ciudad.val}','${telefono.val}','${telefono.val}','02','${ciudad.val}','01',
                        2,'${emailFacturacion.val}','${emailFacturacion.val}',1,GETDATE(),
                        GETDATE(),GETDATE(),GETDATE(),1,0,0
                    );
                ALTER TABLE tblterceros ENABLE TRIGGER ALL;
            `);
            await SQLConexionHGI.close();
        } catch (error) {
            res.status = false;
            return res;
        }

    }

    //Cerrar conexion
    res.status = true;
    return res;
}

objSqlUsuarios.ActualizarTerceroSqlParcial = async (strJsonTercero) => {
    if (strJsonTercero.TipoFormulario == 0) {
        const {
            nombres,
            apellidos,
            tipoDoc,
            documento,
            direccion,
            emailFacturacion,
            ciudad,
            telefono
        } = strJsonTercero;

        let tipoDocumento = tipoDoc.val.split("-");
        /*let rptaCiudad = await objSqlUsuarios.GetCodCiudad(ciudad.val);
        if(rptaCiudad == undefined){
            res.status = 2;
            return res; //No existe la ciudad en la base de datos
        }*/
        const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
        let nombresForm = nombres.val.split(' ');
        let [nombre1, nombre2] = nombresForm;
        let apellidosForm = apellidos.val.split(' ');
        let [apellido1, apellido2] = apellidosForm;
        let sql = `
        ALTER TABLE tblterceros DISABLE TRIGGER ALL;
            UPDATE TblTerceros SET
                StrNombre = '${nombres.val + ' ' + apellidos.val}',
                StrApellido1 = '${apellido1}',
                StrApellido2 = '${apellido2 == undefined ? '' : apellido2}',
                StrNombre1 = '${nombre1}',
                StrNombre2 = '${nombre2 == undefined ? '' : nombre2}',
                StrDireccion = '${direccion.val}',
                StrCelular = '${telefono.val}',
                StrMailFE = '${emailFacturacion.val}'
            WHERE StrIdTercero = '${documento.val}'
            ALTER TABLE tblterceros ENABLE TRIGGER ALL;
        `;
        console.log(sql);
        //await SQLConexionHGI.query(sql);
        /*res.data = rptaCiudad;*/
        await SQLConexionHGI.close();
    } else {
        try {
            const {
                razonSocial,
                nit,
                direccion,
                emailFacturacion,
                ciudad,
                telefono
            } = strJsonTercero;
            /*let rptaCiudad = await objSqlUsuarios.GetCodCiudad(ciudad.val);
            if(rptaCiudad == undefined){
                res.status = 2;
                return res; //No existe la ciudad en la base de datos
            }*/
            const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
            let sql = `
            ALTER TABLE tblterceros DISABLE TRIGGER ALL;
                UPDATE TblTerceros SET
                    StrNombre = '${razonSocial.val}',
                    StrApellido1 = '${razonSocial.val}',
                    StrApellido2 = '${razonSocial.val}',
                    StrNombre1 = '${razonSocial.val}',
                    StrNombre2 = '${razonSocial.val}',
                    StrDireccion = '${direccion.val}',
                    StrCelular = '${telefono.val}',
                    StrMailFE = '${emailFacturacion.val}'
                WHERE StrIdTercero = '${nit.val}'
                ALTER TABLE tblterceros ENABLE TRIGGER ALL;
            `;
            console.log(sql);
            //await SQLConexionHGI.query(sql);
            /*res.data = rptaCiudad;*/
            await SQLConexionHGI.close();
        } catch (error) {
            res.status = false;
            return res;
        }

    }

    //Cerrar conexion
    res.status = true;
    return res;
}

objSqlUsuarios.GetVendedorAsociado = async (intidCiudad) => {
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    //Se consulta el vendedor asociado, en caso de que no tenga vendedor se obtiene la info del usuario recepcion vendedora PAOLA 
    let sql1 = `SELECT Tbllogin.idLogin,Tblvendedores.strCelular,Tblvendedores.strNombre,Tblvendedores.strCedula, Tblvendedores.strEmail FROM dash.tblvendedoreszonas 
    inner join tblzonas on tblzonas.intId = tblvendedoreszonas.intIdZona
    inner join tblciudadeszonas on tblciudadeszonas.intIdZona = tblzonas.intId
    inner join tbllogin on tblvendedoreszonas.strIdVendedor = tbllogin.strIdVendedor
    inner join tblvendedores on tbllogin.strIdVendedor = tblvendedores.strCedula
    WHERE ((tblciudadeszonas.intIdCiudad = ${intidCiudad} and Tblvendedores.idTipoEmpleado = 16 and Tblvendedores.intEstado = 1)) limit 1;`;
    let sql2 = `SELECT Tbllogin.idLogin,Tblvendedores.strCelular,Tblvendedores.strNombre,Tblvendedores.strCedula, Tblvendedores.strEmail FROM dash.tblvendedoreszonas 
    inner join tblzonas on tblzonas.intId = tblvendedoreszonas.intIdZona
    inner join tblciudadeszonas on tblciudadeszonas.intIdZona = tblzonas.intId
    inner join tbllogin on tblvendedoreszonas.strIdVendedor = tbllogin.strIdVendedor
    inner join tblvendedores on tbllogin.strIdVendedor = tblvendedores.strCedula
    WHERE (tbllogin.idLogin = 75) limit 1;`;
    const [rows, fields] = await SQLConexionDASH.execute(sql1);
    if(rows[0] == undefined){
        const [rpta] = await SQLConexionDASH.execute(sql2);
        await SQLConexionDASH.close();
        return rpta[0];
    }
    console.log("vendedor asociado");
    console.log(rows[0]);
    await SQLConexionDASH.close();
    return rows[0];
}

objSqlUsuarios.UpdateContraseñaUsuario = async (email, passnew, passold) => {
    const SQLConexionDASH = await databaseSQL.ConexionSQL_DASH();
    const [rows, fields] = await SQLConexionDASH.execute(`
    update tblusuariosweb set strContrasena = ? where strEmail = ? and strContrasena = ?`, [passnew, email, passold]);
    await SQLConexionDASH.close();
    console.log(rows)
    return rows.changedRows;
}

module.exports = objSqlUsuarios;