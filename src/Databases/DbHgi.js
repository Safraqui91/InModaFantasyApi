const mssql = require('mssql');

module.exports = class Sql {
    connect() {
        const sqlConfig = {
            user: 'Hgi',
            password: 'Hgi',
            database: 'INMODANET',
            server: `192.168.1.127\\SQLEXPRESS`,
            pool: {
                max: 1000,
                min: 1,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false, // for azure
                trustServerCertificate: false, // change to true for local dev / self-signed certs
                enableArithAbort: true
            }
        }
        return mssql.connect(sqlConfig)
    }

    close() {
        return mssql.close();
    }

    async execute(sql) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                return pool.request().query(sql);
            }).then(result => {
                resolve(result);
            }).catch(err => {
                console.log("promesaaaaa")
                console.log(err);
                reject(err);
            }).finally(()=>{
                //mssql.close();
            });
        });
    }

}