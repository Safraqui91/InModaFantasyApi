const databaseSQL = require('../Databases/databaseSQL.js');
const objContactos = {};

objContactos.ConsultarContactos = async(strIdTercero)=>{
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    let sql = `select  StrIdContacto, StrNombres, StrApellidos, StrTelefono, StrCelular, StrProfesion as 'StrCompra', StrParentesco as 'StrPaga' 
    from TblContactos where StrTercero = '`+strIdTercero+`'`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

objContactos.CrearContacto = async({cedula, StrIdTercero, nombre, apellido, compra, paga, telefono})=>{
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    compra = compra.val?'1':'0';
    paga = paga.val?'1':'0';
    let sql = `ALTER TABLE [dbo].[TblContactos] DISABLE TRIGGER ALL;
    INSERT INTO [dbo].[TblContactos]
        ([StrIdContacto]
        ,[StrTercero]
        ,[StrApellidos]
        ,[StrNombres]
        ,[DatFechaNac]
        ,[StrCargo]
        ,[StrProfesion]
        ,[StrParentesco]
        ,[StrMail]
        ,[StrTelefono]
        ,[StrExtension]
        ,[StrCelular]
        ,[DatFechaAct]
        ,[IntPerfil])
        VALUES
        ('`+cedula.val+`','`+StrIdTercero+`','`+apellido.val+`','`+nombre.val+`','','','`+compra+`','`+paga+`','',`+telefono.val+`,'','','',null)`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

objContactos.ActualizarContacto = async({StrIdTercero,  nombre, apellido, compra, paga, idContacto})=>{
    const SQLConexionHGI = await databaseSQL.ConexionSQL_HGI();
    compra = compra.val?'1':'0';
    paga = paga.val?'1':'0';
    let sql = `ALTER TABLE [dbo].[TblContactos] DISABLE TRIGGER ALL;
    UPDATE [dbo].[TblContactos]
    SET [StrApellidos] = '`+apellido.val+`'
       ,[StrNombres] = '`+nombre.val+`'
       ,[StrProfesion] = '`+compra+`'
       ,[StrParentesco] = '`+paga+`'
    where StrTercero = '`+StrIdTercero+`' and StrIdContacto = '`+idContacto+`'`;
    let rpta = await SQLConexionHGI.query(sql);
    await SQLConexionHGI.close();
    return rpta['recordset'];
}

module.exports = objContactos;
