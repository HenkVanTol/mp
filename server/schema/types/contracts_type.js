const graphql = require('graphql');

const {
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType
} = graphql;

const ContractsType = new GraphQLObjectType({
    name: 'ContractsType',
    fields: {
        ContractID: { type: GraphQLInt },
        Ref: { type: GraphQLString }
    }
});

module.exports = ContractsType;