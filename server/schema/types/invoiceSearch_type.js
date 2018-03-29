const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat
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
    }
});

module.exports = InvoiceSearchType;