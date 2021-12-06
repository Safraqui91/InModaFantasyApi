const sql = require('mssql');
const mysql = require('mysql2/promise');
const objSQL = {};
objSQL.ConexionSQL_HGI = async () => {
    try {
        // Hacer conexión HGI
        const sqlConfig = {
            user: 'Hgi',
            password: 'Hgi',
            database: 'INMODANET',
            server: `192.168.1.127\\SQLEXPRESS`,
            pool: {
                max: 1000,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false, // for azure
                trustServerCertificate: false, // change to true for local dev / self-signed certs
                enableArithAbort: true
            }
        }
        //let pool = await sql.connect('mssql://Hgi:Hgi@192.168.1.127/INMODANET')
        let pool = await sql.connect(sqlConfig)
        //console.log(pool)
        return pool;
    } catch (err) {
        console.log(err);
    }
}
objSQL.ConexionSQL_DASH = async () => {
    try {
        // Hacer conexión DASH
        return await mysql.createConnection({
            host: '192.168.1.128',
            user: 'root',
            password: 'Sistemas2018*',
            database: 'DASH'
        });
    } catch (err) {
        console.log(err);
    }
}
module.exports = objSQL;