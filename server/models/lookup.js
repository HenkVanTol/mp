const db = require('../db');

 function getAll() {
     return new Promise(function (resolve, reject) {
         db.get().request().query('select * from dbo.hierarchyType')
             .then(result => {
                 resolve(result.recordset);
             })
             .catch(error => {
                 reject(error);
             });
     });
}

module.exports = { getAll };