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

const InvoiceSearchType = new GraphQLObjectType({
    name: 'InvoiceSearchType',
    fields: {
        InvoiceID: { type: GraphQLInt },
        InvoiceNumber: { type: GraphQLString },
        ContractID: { type: GraphQLInt },
        ContractDescription: { type: GraphQLString },
        StatusID: { type: GraphQLInt },
        StatusDescription: { type: GraphQLString },
        Value: { type: GraphQLFloat },
        DateRaised: { type: GraphQLDate },
        InvoiceStatuses: {
            type: new GraphQLList(InvoiceStatusesType),
            resolve() {
                return InvoiceService.InvoiceStatuses();
            }
        },
        Contracts: {
            type: new GraphQLList(ContractsType),
            resolve() {
                console.log("Resolving contracts");
                return InvoiceService.Contracts();
            }
        }
    }
});

module.exports = InvoiceSearchType;