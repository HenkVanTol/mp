const mssql = require('mssql');

const config = {
    user: 'sa',
    password: 'Kc1p1tlum',
    server: '192.168.25.181', // You can use 'localhost\\instance' to connect to named instance
    database: 'MultiPick',
    // options: {
    //     encrypt: true // Use this if you're on Windows Azure
    // }
}

var state = {
    pool: null
};

function connect(options) {
    return new Promise(function (resolve, reject) {
        mssql.connect(options)
            .then(pool => {
                state.pool = pool;
                resolve(pool);
            })
            .catch(error => reject(error));
    });
}

function get() {
    return state.pool;
}

module.exports = { connect, get };