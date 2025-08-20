const mariadb = require("mariadb");

const connection = mariadb.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    bigIntAsNumber: true
})

const getConnection = () => {
    return connection
}

module.exports = getConnection;