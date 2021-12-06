const objSqlContactos = require('../Models/Contactos');
const objContactos = {};
objContactos.ConsultarContactos = (req, res) => {
    const {strIdTercero} = req.params;
    objSqlContactos.ConsultarContactos(strIdTercero).then(rpta =>{
        res.json({
            Success : true,
            strData : rpta
        })
    }).catch(error =>{
        res.json({
            Success : true,
            strMensaje : error
        })
    })
}

objContactos.CrearContacto = (req, res) =>{
    objSqlContactos.CrearContacto(req.body).then(rpta =>{
        res.json({
            Success : true,
            strMensaje : "Contacto creado con éxito!"
        })
    }).catch(error =>{
        res.json({
            Success : true,
            strMensaje : error
        })
    })
}

objContactos.ActualizarContacto = (req, res) => {
    objSqlContactos.ActualizarContacto(req.body).then(rpta =>{
        res.json({
            Success : true,
            strMensaje : "Contacto actualizado con éxito!"
        })
    }).catch(error =>{
        res.json({
            Success : true,
            strMensaje : error
        })
    })
}

module.exports = objContactos;