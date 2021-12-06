const objUsuarios = {};
const { rows } = require("mssql");
const databaseSQL = require("../Databases/databaseSQL.js");
const objSqlUsuarios = require("../Models/Usuarios");
const objSqlTerceros = require("../Models/Tercero");
const objHelpers = require("../helpers");
const auth = require("../authenticate");

objUsuarios.RegistrarUsuarioJwt = async (req, res) => {
  const { names, email, pass, checkInfoEmail } = req.body;
  const files = req.files;
  //El registro en el HGI lo hace la persona encargada de los terceros
  objSqlUsuarios.GetUsuario(email).then((rows) => {
    if (rows.length == 0) {
      objSqlUsuarios
        .CrearUsuario(req.body)
        .then((rows) => {
          objSqlUsuarios
            .GetTerceroEmailId(req.body.email, req.body.documento)
            .then(async (JsonTercero) => {
              const token = auth.generateToken(email);
              let data = {
                token,
              };
              if (JsonTercero == undefined) {
                data = {
                  ...data,
                  StrNombre: names,
                  StrApellido: req.body.lastName,
                  StrIdTercero: req.body.documento,
                  IntTipoTercero: 3,
                  StrCiudadDescripcion: "",
                  IntTelefono: req.body.phone,
                  StrDireccion: req.body.address,
                  StrEmail: req.body.email,
                  StrTipoId: req.body.TipoDoc,
                  StrCiudad: req.body.city,
                };
                let JsonVendedor = await objSqlUsuarios.GetVendedorAsociado(
                  "00000"
                );
                data.JsonVendedor = JsonVendedor;
                //Registrar en el hgi como comprador
                let rpta = await objSqlTerceros.CrearCompradorEcommerce(data);
                if (rpta === false) {
                  res.json({
                    Success: false,
                    strMensaje: "Hubo un error al registrar el usuario",
                  });
                }
              } else {
                JsonTercero = {
                  ...JsonTercero,
                  token,
                };
                data = JsonTercero;
                let JsonVendedor = await objSqlUsuarios.GetVendedorAsociado(
                  JsonTercero.StrCiudad
                );
                data.JsonVendedor = JsonVendedor;
              }
              objHelpers
                .EnviarEmailRegistroTercero(req.body, files)
                .then((e) => {
                  res.json({
                    Success: true,
                    data,
                  });
                })
                .catch((e) => {
                  console.log(e);
                  res.json({
                    Success: false,
                    strMensaje: "Hubo un error al enviar el email." + e,
                  });
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          res.json({
            Success: false,
            strMensaje: error,
          });
        });
    } else {
      res.json({
        Success: false,
        strMensaje: "Email ya registrado",
      });
    }
  });
};

objUsuarios.IniciarSesionJwt = async (req, res) => {
  const { email, pass } = req.body;
  objSqlUsuarios.GetUsuario(email.val, pass.val).then(async (rows) => {
    if (rows.length == 0) {
      //Consultar tercero por email y cedula
      let JsonTercero = await objSqlUsuarios.GetTerceroEmailId(
        email.val,
        pass.val
      );
      if (JsonTercero !== undefined) {
        if (JsonTercero.length !== 0) {
          //Crear usuario en el DASH
          const data = {
            email: email.val,
            pass: pass.val,
            names: JsonTercero.StrNombre,
            documento: pass.val,
            TipoFormulario: "",
            checkInfoEmail: "true",
          };
          await objSqlUsuarios.CrearUsuario(data);
          //Vendedor asociado
          objSqlUsuarios
            .GetVendedorAsociado(JsonTercero.StrCiudad)
            .then(async (JsonVendedor) => {
              JsonTercero.JsonVendedor = JsonVendedor;
              if (JsonTercero.intprecio == 3 || JsonTercero.intprecio == 0) {
                const rpta = await objSqlTerceros.ValidarCompras(
                  rows[0].strIdTercero,
                  3
                );
                if (rpta.length >= 3) {
                  let r = await objSqlTerceros.UpdateListaPrecio(
                    rows[0].strIdTercero,
                    "02"
                  );
                  if (r[0] >= 1) {
                    JsonTercero.intprecio = 2;
                  }
                }
              } else if (JsonTercero.intprecio == 2) {
                const rpta = await objSqlTerceros.ValidarCompras(
                  rows[0].strIdTercero,
                  2
                );
                if (rpta.length >= 1) {
                  objHelpers
                    .EnviarEmailAlertaPrecioTercero(JsonTercero)
                    .catch((e) => {
                      console.log("Hubo un error al enviar el email." + e);
                    });
                }
              } else {
                console.log("lista de precio no valida para cambio!!!");
              }
              const token = auth.generateToken(email);
              const data = {
                token,
                JsonTercero,
              };
              res.json({
                Success: true,
                strMensaje: data,
              });
            });
        } else {
          res.json({
            Success: false,
            strMensaje: "Usuario no registrado",
          });
        }
      } else {
        res.json({
          Success: false,
          strMensaje: "Usuario y/o contraseña incorrectos ",
        });
      }
    } else {
      objSqlUsuarios
        .GetTercero(rows[0].strIdTercero)
        .then((JsonTercero) => {
          if (JsonTercero !== undefined) {
            objSqlUsuarios
              .GetVendedorAsociado(JsonTercero.StrCiudad)
              .then(async (JsonVendedor) => {
                JsonTercero.JsonVendedor = JsonVendedor;
                if (JsonTercero.intprecio == 3 || JsonTercero.intprecio == 0) {
                  const rpta = await objSqlTerceros.ValidarCompras(
                    rows[0].strIdTercero,
                    3
                  );
                  if (rpta.length >= 3) {
                    let r = await objSqlTerceros.UpdateListaPrecio(
                      rows[0].strIdTercero,
                      "02"
                    );
                    if (r[0] >= 1) {
                      JsonTercero.intprecio = 2;
                    }
                  }
                } else if (JsonTercero.intprecio == 2) {
                  const rpta = await objSqlTerceros.ValidarCompras(
                    rows[0].strIdTercero,
                    2
                  );
                  if (rpta.length >= 1) {
                    objHelpers
                      .EnviarEmailAlertaPrecioTercero(JsonTercero)
                      .catch((e) => {
                        console.log("Hubo un error al enviar el email." + e);
                      });
                  }
                } else {
                  console.log("lista de precio no valida para cambio!!!");
                }
                const token = auth.generateToken(email);
                const data = {
                  token,
                  JsonTercero,
                };
                res.json({
                  Success: true,
                  strMensaje: data,
                });
              });
          } else {
            res.json({
              Success: false,
              strMensaje:
                "Sus datos están siendo validados, comunicate con uno de nuestros asesores",
            });
          }
        })
        .catch((e) => {
          res.json({
            Success: false,
            strMensaje:
              "Ocurrió un error al ingresar, comunicate con uno de nuestros asesores",
          });
        });
    }
  });
};

objUsuarios.RegistrarUsuario = async (req, res) => {
  const { email, pass, nombres, apellidos, TipoFormulario, documento, nit } =
    req.body;
  objSqlUsuarios.GetUsuario(email.val).then((rows) => {
    if (rows.length == 0) {
      objSqlUsuarios.CrearTerceroSqlParcial(req.body).then((rptaHgi) => {
        if (rptaHgi.status === true || rptaHgi.status == 1) {
          objSqlUsuarios
            .CrearUsuario(req.body)
            .then((rows) => {
              objSqlUsuarios
                .GetTercero(
                  req.body.documento.val == ""
                    ? req.body.nit.val
                    : req.body.documento.val
                )
                .then((JsonTercero) => {
                  objSqlUsuarios
                    .GetVendedorAsociado(JsonTercero.StrCiudad)
                    .then((JsonVendedor) => {
                      JsonTercero.JsonVendedor = JsonVendedor;
                      objHelpers
                        .EnviarEmailRegistroTercero(req.body)
                        .then((e) => {
                          res.json({
                            Success: true,
                            strMensaje: JsonTercero,
                          });
                        })
                        .catch((e) => {
                          res.json({
                            Success: false,
                            strMensaje: "Hubo un error al enviar el email." + e,
                          });
                        });
                    });
                });
            })
            .catch((error) => {
              res.json({
                Success: false,
                strMensaje: error,
              });
            });
        } else if (rptaHgi.status == 2) {
          res.json({
            Success: false,
            strMensaje: "No existe la ciudad",
          });
        } else {
          res.json({
            Success: false,
            strMensaje: "Hubo un problema con el registro",
          });
        }
      });
      /*objSqlUsuarios.ActualizarTerceroSqlParcial(req.body).then(rptaHgi =>{
                console.log(rptaHgi);
                if(rptaHgi.status === true || rptaHgi.status == 1){
                    objSqlUsuarios.CrearUsuario(req.body).then(rows=>{
                        objSqlUsuarios.GetVendedorAsociado(JsonTercero.StrCiudad).then(JsonVendedor =>{
                            JsonTercero.JsonVendedor = JsonVendedor;
                                objHelpers.EnviarEmailRegistroTercero(req.body)
                                .then(e =>{
                                    res.json({
                                        Success: true, strMensaje: JsonTercero 
                                    });
                                })
                                .catch(e=>{
                                    res.json({
                                        Success: false, strMensaje: "Hubo un error al enviar el email." + e
                                    });
                                });
                        });
                    }).catch(error =>{
                        res.json({
                            Success: false, strMensaje: error 
                        });
                    });
                }else if(rptaHgi.status == 2){
                    res.json({
                        Success: false, strMensaje: 'No existe la ciudad' 
                    });
                }else{
                    res.json({
                        Success: false, strMensaje: 'Hubo un problema con el registro' 
                    });
                }
            })*/
    } else {
      res.json({
        Success: false,
        strMensaje: "Email ya registrado",
      });
    }
  });
};

objUsuarios.IniciarSesion = async (req, res) => {
  const { email, pass } = req.body;
  objSqlUsuarios.GetUsuario(email.val, pass.val).then((rows) => {
    if (rows.length == 0) {
      res.json({
        Success: false,
        strMensaje: "Usuario no registrado",
      });
    } else {
      objSqlUsuarios
        .GetTercero(rows[0].strIdTercero)
        .then((JsonTercero) => {
          objSqlUsuarios
            .GetVendedorAsociado(JsonTercero.StrCiudad)
            .then((JsonVendedor) => {
              JsonTercero.JsonVendedor = JsonVendedor;
              if (JsonTercero.intprecio == 3 || JsonTercero.intprecio == 0) {
                objSqlTerceros
                  .ValidarCompras(rows[0].strIdTercero, 3)
                  .then(async (rpta) => {
                    if (rpta.length >= 3) {
                      await objSqlTerceros.UpdateListaPrecio(
                        rows[0].strIdTercero,
                        "02"
                      );
                      JsonTercero.intprecio = 2;
                    }
                  });
              } else if (JsonTercero.intprecio == 2) {
                objSqlTerceros
                  .ValidarCompras(rows[0].strIdTercero, 2)
                  .then(async (rpta) => {
                    if (rpta.length >= 1) {
                      objHelpers
                        .EnviarEmailAlertaPrecioTercero(JsonTercero)
                        .catch((e) => {
                          console.log("Hubo un error al enviar el email." + e);
                        });
                    }
                  });
              }
              res.json({
                Success: true,
                strMensaje: JsonTercero,
              });
            });
        })
        .catch((e) => {
          res.json({
            Success: false,
            strMensaje: "Ocurrió un error al ingresar",
          });
        });
    }
  });
};

objUsuarios.ValidarEmail = () => {};

objUsuarios.EnviarTokenEmail = (req, res) => {
  const { email } = req.body;
  objSqlUsuarios
    .GetUsuario(email.val)
    .then((rows) => {
      if (rows.length == 0) {
        res.json({
          Success: true,
          strMensaje: "El correo electrónico no se encuentra registrado",
        });
      } else {
        const token = auth.generateTokenExpire({
          pass: rows[0].strContrasena,
          email: email.val,
        });
        objHelpers
          .EnviarEmailToken(email.val, token)
          .then((e) => {
            res.json({
              Success: true,
            });
          })
          .catch((e) => {
            console.log(e);
            res.json({
              Success: false,
              strMensaje: "Hubo un error al enviar el email." + e,
            });
          });
        res.json({
          Success: true,
          strMensaje: token,
        });
      }
    })
    .catch((error) => {
      res.json({
        Success: false,
        strMensaje: "Hubo un error, por favor inténtelo nuevamente",
      });
    });
};

objUsuarios.CambiarClaveUsuaro = (req, res) => {
  const token = req.body.token.data;
  const { email, pass } = token;
  const passnew = req.body.pass.val;
  objSqlUsuarios
    .UpdateContraseñaUsuario(email, passnew, pass)
    .then((rows) => {
      if (rows === 1) {
        res.json({
          Success: true,
        });
      } else {
        res.json({
          Success: false,
          strMensaje: "Hubo un error al actualizar la contraseña",
        });
      }
    })
    .catch((e) => {
      res.json({
        Success: false,
        strMensaje:
          "Hubo un error al actualizar la contraseña, por favor intente nuevamente",
      });
    });
};

objUsuarios.validacionCompras = (req, res) => {
  const { strIdTercero } = req.query;
  objSqlTerceros.ValidarCompras(strIdTercero, 3).then(async (rpta) => {
    let strMensaje = 0;
    if (rpta.length <= 2) {
      strMensaje = 1;
    } else if (rpta.length == 3) {
      let r = await objSqlTerceros.UpdateListaPrecio(strIdTercero, "02");
      if (r[0] >= 1) {
        strMensaje = 2;
      }
    }
    res.json({
      Success: true,
      strMensaje,
    });
  });
};

objUsuarios.actualizarPrecio = (req, res) => {
  const { intListaPrecio, strIdTercero } = req.body;
  objSqlTerceros
    .UpdateListaPrecio(strIdTercero, intListaPrecio)
    .then(async (rpta) => {
      console.log(rpta);
      res.json({
        Success: true,
      });
    });
};

module.exports = objUsuarios;
