const graphql = require('graphql');
const InvoiceStatusesType = require('./invoiceStatuses_type');
const ContractsType = require('./contracts_type');
const InvoiceService = require('../../services/invoice');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList
} = graphql;

const GraphQLDate = require('graphql-date');

const InvoiceLookupType = new GraphQLObjectType({
    name: 'InvoiceLookupType',
    fields: {
        InvoiceStatuses: {
            type: new GraphQLList(InvoiceStatusesType),
            resolve() {
                return InvoiceService.InvoiceStatuses();
            }
        },
        Contracts: {
            type: new GraphQLList(ContractsType),
            resolve() {
                return InvoiceService.Contracts();
            }
        }
    }
});

module.exports = InvoiceLookupType;