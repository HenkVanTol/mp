const AssetMasterModel = require('../models/assetMaster');

function find(name, description) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.find(name, description)
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function create(assetMaster) {
    return new Promise((resolve, reject) => {
        AssetMasterModel.create(assetMaster)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}
module.exports = { find, create };