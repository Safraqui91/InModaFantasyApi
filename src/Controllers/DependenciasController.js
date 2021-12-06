const objDependencias = {};
const databaseSQL = require("../Databases/databaseSQL.js");
const objSqlTerceros = require("../Models/Tercero");

objDependencias.ConsultarDependencia = async (req, res) => {
  const { strIdTercero } = req.params;

  objSqlTerceros.GetDependencia(strIdTercero).then((JsonTercero) => {
    if (JsonTercero) {
      res.json({
        Success: true,
        strMensaje: JsonTercero,
      });
    } else {
      res.json({
        Success: false,
        strMensaje: "Hubo un error al consultar",
      });
    }
  });
};

objDependencias.ActualizarDependencia = async (req, res) => {
  objSqlTerceros.UpdateDependencia(req.body).then((rpta) => {
    if (rpta) {
      res.json({
        Success: true,
        strMensaje: "Dependencia actualizada",
      });
    } else {
      res.json({
        Success: false,
        strMensaje: "Hubo un error al actualizar",
      });
    }
  });
};

objDependencias.NuevaDependencia = async (req, res) => {
  objSqlTerceros.NewDependencia(req.body).then((rpta) => {
    if (rpta) {
      res.json({
        Success: true,
        strMensaje: "Dependencia creada",
      });
    } else {
      res.json({
        Success: false,
        strMensaje: "Hubo un error al crear dependencia",
      });
    }
  });
};

module.exports = objDependencias;
