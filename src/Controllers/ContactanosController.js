//const objSqlContactos = require('../Models/Contactos');
const objHelpers = require('../helpers');
const objContactanos = {};
objContactanos.EnviarComentario = (req, res) => {
    const {name, email, phone, comments} = req.body;
    objHelpers.EnviarEmailContactanos(req.body)
    .then(e =>{
        res.json({
            Success: true 
        });
    })
    .catch(e=>{
        console.log(e);
        res.json({
            Success: false, strMensaje: "Hubo un error al enviar el email." + e
        });
    });
    console.log(req.body);
}

module.exports = objContactanos;