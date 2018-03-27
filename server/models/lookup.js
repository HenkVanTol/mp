const db = require('../db');

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