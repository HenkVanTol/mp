const InvoiceModel = require('../models/invoice');

function InvoiceSearch(InvoiceNumber, StatusID) {
    return new Promise((resolve, reject) => {
        InvoiceModel.InvoiceSearch(InvoiceNumber, StatusID)
            .then(results => resolve(results))
            .catch(error => reject(error))
    });
}

function InvoiceByID(InvoiceID) {
    return new Promise((resolve, reject) => {
        InvoiceModel.InvoiceByID(InvoiceID)
            .then(results => resolve(results))
            .catch(error => reject(error))
    });
}

function CreateInvoice(Invoice) {
    return new Promise((resolve, reject) => {
        InvoiceModel.CreateInvoice(Invoice)
            .then(result => resolve(result))
            .catch(error => reject(err));
    });
}

function InvoiceStatuses() {
    return new Promise((resolve, reject) => {
        InvoiceModel.InvoiceStatuses()
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

module.exports = { InvoiceSearch, InvoiceByID, CreateInvoice, InvoiceStatuses };