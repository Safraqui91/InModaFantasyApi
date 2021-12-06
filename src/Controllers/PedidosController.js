const objSqlPedidos = require('../Models/Pedidos');
const objSqlPedido = require('../Models/Pedidos');
const objHelpers = require('../helpers');
const objPedidos = {};

objPedidos.ConsultarPedidosDash = async (req, res) => {

}

objPedidos.EnviarPedidoDash = async (req, res) => {
    let {strDependencias, blDescuento, blDescuento2} = req.body.documento;
    if(strDependencias.length == 0){
        req.body.documento.strNombreDependencia = null;
        req.body.documento.strIdDependencia = null;
        EnviarPedidoDashModel(req, res);
    }else{
        for (let index = 0; index < strDependencias.length; index++) {
            const val = strDependencias[index];
            const {label : dependencia, value : id} = val;
            req.body.documento.strNombreDependencia = dependencia;
            req.body.documento.strIdDependencia = id;
            await objSqlPedido.EnviarPedidoLocalDash(req.body.documento).then(async rpta=>{
                if(rpta.serverStatus == 2){
                    let idPed = rpta.intIdPedido;
                    await objSqlPedidos.EnviarDetallePedidoLocalDash(req.body.detalle, rpta.intIdPedido, blDescuento, blDescuento2).then(async rpta=>{
                        await objHelpers.EnviarEmailPedidoFinalizado(req.body.documento.jsonVendedor.strEmail, req.body.documento.strNombCliente, req.body.documento.strNombreDependencia, idPed, req.body.documento.strObservacion)
                            .then(()=>{
                            })
                            .catch(e=>{
                                res.json({
                                    Success: false, strMensaje: e
                                });
                            });
                    })
                    .catch(e=>{
                        res.json({
                            Success: false, strMensaje: e
                        });
                    })
                }else{
                    res.json({
                        Success: false, strMensaje: "Hubo un error al enviar pedido." 
                    });
                }
            }).catch(e =>{
                console.log(e);
                res.json({
                    Success: false, strMensaje: "Hubo un error al enviar pedido." 
                });
            });
        }
        res.json({
            Success: true, strMensaje: "Pedido enviado con exito." 
        });
    }
}

const EnviarPedidoDashModel = (req, res)=>{
    objSqlPedido.EnviarPedidoLocalDash(req.body.documento).then(rpta=>{
        if(rpta.serverStatus == 2){
            let idPed = rpta.intIdPedido;
            objSqlPedidos.EnviarDetallePedidoLocalDash(req.body.detalle, rpta.intIdPedido,req.body.documento.blDescuento, req.body.documento.blDescuento2).then(rpta=>{
                objHelpers.EnviarEmailPedidoFinalizado(req.body.documento.jsonVendedor.strEmail, req.body.documento.strNombCliente, "", idPed, req.body.documento.strObservacion)
                    .then(()=>{
                        res.json({
                            Success: true, strMensaje: "Pedido enviado con exito." 
                        });
                    })
                    .catch(e=>{
                        res.json({
                            Success: false, strMensaje: e
                        });
                    });
            })
            .catch(e=>{
                res.json({
                    Success: false, strMensaje: e
                });
            })
        }else{
            res.json({
                Success: false, strMensaje: "Hubo un error al enviar pedido." 
            });
        }
    }).catch(e=>{
        console.log(e);
        res.json({
            Success: false, strMensaje: e
        });
    });
}

objPedidos.ConsultarPedidoDash = async (req, res) => {
    
}

objPedidos.ActualizarPedidoDash = async (req, res) => {
    
}

objPedidos.EliminarPedidoDash = async (req, res) => {
    
}

objPedidos.ActualizarDetallePedido = async (req, res) => {
    objSqlPedido.ActualizarDetallePedido(req.body).then(rpta=>{
        res.json({
            Success: true, strMensaje: rpta
        });
    })
    .catch(e=>{
        res.json({
            Success: false, strMensaje: e
        });
    });
}

module.exports = objPedidos;