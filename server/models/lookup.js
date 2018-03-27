const db = require('../db');

const config = {
    user: 'sa',
    password: 'Kc1p1tlum',
    server: '192.168.25.181', 
    database: 'MultiPick',
    // options: {
    //     encrypt: true // Use this if you're on Windows Azure
    // }
}

 function getAll() {
     return new Promise(function (resolve, reject) {
         db.get().request().query('select * from dbo.hierarchyType')
             .then(result => {
                 console.log("RESULT: ", result.recordset);
                 resolve(result.recordset);
             })
             .catch(error => {
                 console.log("ERROR: ", error);
                 reject(error);
             });
     });
}

module.exports = { getAll };