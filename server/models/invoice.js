const db = require('../db');
const sql = require('mssql');

function InvoiceSearch(InvoiceNumber, StatusID) {
    return new Promise(function (resolve, reject) {
        db.get().request()
            .input("InvoiceNumber", sql.VarChar(100), InvoiceNumber)
            .input("StatusID", sql.Int, StatusID)
            .execute("ServiceBasedBilling._InvoiceSearch")
            .then((result) => {
                resolve(result.recordset);
            })
            .catch(error => reject(error));
    });
}

function InvoiceByID(InvoiceID) {
    return new Promise(function (resolve, reject) {
        db.get().request()
            .input("InvoiceID", sql.Int, InvoiceID)
            .execute("ServiceBasedBilling._InvoiceByID")
            .then(result => resolve(result.recordset))
            .catch(error => reject(error));
    });
}

function CreateInvoice(Invoice) {
    return new Promise(function (resolve, reject) {
        db.get().request()
            .input("InvoiceNumber", sql.VarChar(100), Invoice.InvoiceNumber)
            .input("ContractID", sql.Int, Invoice.ContractID)
            .input("StatusID", sql.Int, Invoice.StatusID)
            .input("DateRaised", sql.DateTime, Invoice.DateRaised)
            .input("Value", sql.Decimal(18, 5), Invoice.Value)
            .query("insert into ServiceBasedBilling.Invoice (InvoiceNumber, ContractHeaderID, InvoiceStatusID, DateRaised, Value) values (@InvoiceNumber, @ContractID, @StatusID, @DateRaised, @Value)")
            .then(result => resolve(result.recordset))
            .catch(error => reject(error));
    });
}

function UpdateInvoice(Invoice) {
    return new Promise(function (resolve, reject) {
        console.log("in update");
        console.log("Invoice: ", Invoice);
        db.get().request()
            .input("InvoiceID", sql.Int, Invoice.InvoiceID)
            .input("InvoiceNumber", sql.VarChar(100), Invoice.InvoiceNumber)
            .input("ContractID", sql.Int, Invoice.ContractID)
            .input("StatusID", sql.Int, Invoice.StatusID)
            .input("DateRaised", sql.DateTime, Invoice.DateRaised)
            .input("Value", sql.Decimal(18, 5), Invoice.Value)
            .query("update ServiceBasedBilling.Invoice set InvoiceNumber = @InvoiceNumber, ContractHeaderID = @ContractID, InvoiceStatusID = @StatusID, DateRaised = @DateRaised, Value = @Value where InvoiceID = @InvoiceID")
            .then(result => resolve(result.recordset))
            .catch(error => {
                console.log("error: ", error);
                reject(error)
            });
    });
}

function InvoiceStatuses() {
    return new Promise(function (resolve, reject) {
        db.get().request()
            .query("select InvoiceStatusID, Ref from ServiceBasedBilling.InvoiceStatus order by ref")
            .then(result => resolve(result.recordset))
            .catch(error => reject(error));
    });
}

module.exports = { InvoiceSearch, InvoiceByID, CreateInvoice, InvoiceStatuses, UpdateInvoice };