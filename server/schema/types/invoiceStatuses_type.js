const graphql = require('graphql');

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType
} = graphql;

const InvoiceStatusesType = new GraphQLObjectType({
    name: 'InvoiceStatusesType',
    fields: {
        InvoiceStatusID: { type: GraphQLInt },
        Ref: { type: GraphQLString }
    }
});

module.exports = InvoiceStatusesType;