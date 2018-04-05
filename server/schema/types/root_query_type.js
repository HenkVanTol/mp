const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = graphql;
const UserType = require('./user_type');
const InvoiceSearchType = require('./invoiceSearch_type');
const InvoiceStatusesType = require('./invoiceStatuses_type');
const ContractsType = require('./contracts_type');
const InvoiceService = require('../../services/invoice');
const GraphQLDate = require('graphql-date');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        return req.user;
      }
    },
    InvoiceSearch: {
      type: new GraphQLList(InvoiceSearchType),
      args: {
        InvoiceNumber: { type: GraphQLString },
        StatusID: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return InvoiceService.InvoiceSearch(args.InvoiceNumber, args.StatusID);
      }
    },
    InvoiceByID: {
      type: new GraphQLList(InvoiceSearchType),
      args: {
        InvoiceID: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return InvoiceService.InvoiceByID(args.InvoiceID);
      }
    },
    InvoiceStatuses: {
      type: new GraphQLList(InvoiceStatusesType),
      resolve() {
        return InvoiceService.InvoiceStatuses();
      }
    }
  }
});

module.exports = RootQueryType;
