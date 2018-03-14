const db = require('../db');

function find(name, description) {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from assetMaster where name = ?', name, function (err, rows) {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function create(assetMaster) {
    return new Promise((resolve, reject) => {
        let values = [assetMaster.name, assetMaster.description, assetMaster.serial,
        assetMaster.registration, assetMaster.acquisitionDate, assetMaster.retirementDate, assetMaster.hierarchyTypeId];
        console.log("values: ", values);
        db.get().query("insert into assetMaster (name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId) values (?)", [values], function (err, result) {
            if (err) return reject(err);
            resolve({
                id: result.insertId,
                name: assetMaster.email,
                description: assetMaster.password,
                serial: assetMaster.serial,
                registration: assetMaster.registration,
                purchasePrice: assetMaster.purchasePrice,
                acquisitionDate: assetMaster.acquisitionDate,
                retirementDate: assetMaster.retirementDate,
                hierarchyTypeId: assetMaster.hierarchyTypeId
            });
        });
    });
}

module.exports = { find, create };