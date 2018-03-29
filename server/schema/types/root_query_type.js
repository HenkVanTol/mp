const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = graphql;
const UserType = require('./user_type');
const AssetMasterType = require('./asset_master_type');
const InvoiceSearchType = require('./invoiceSearch_type');
const HierarchyTypeType = require('./hierarchyType_type');
const InvoiceStatusesType = require('./invoiceStatuses_type');
const AssetMasterService = require('../../services/assetMaster');
const InvoiceService = require('../../services/invoice');
const LookupService = require('../../services/lookup');
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
    assetMaster: {
      type: new GraphQLList(AssetMasterType),
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return AssetMasterService.find(args.name, args.description);
      }
    },
    hierarchyType: {
      type: new GraphQLList(HierarchyTypeType),
      resolve() {
        return LookupService.getAll();
      }
    },
    assetMasterById: {
      type: AssetMasterType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return AssetMasterService.findById(args.id);
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
    // customer: {
    //   args: {
    //     name: {
    //       type: GraphQLString
    //     },
    //     surname: {
    //       type: GraphQLString
    //     },
    //     email: {
    //       type: GraphQLString
    //     },
    //     purchases: {
    //       type: GraphQLInt
    //     }
    //   },
    //   type: new GraphQLList(CustomerType),
    //   resolve(parentValue, args, req) {
    //     CustomerService.findCustomers(args, (err, result) => {
    //       if (err) {
    //         console.log(err);
    //       }
    //       else {
    //         console.log({ customer: result});
    //         return { customer: result};
    //       }
    //     });
    //     return CustomerService.findCustomersProm(args);
    //   }
    // }
  }
});

module.exports = RootQueryType;
