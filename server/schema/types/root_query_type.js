const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = graphql;
const UserType = require('./user_type');
const AssetMasterType = require('./asset_master_type');
const HierarchyTypeType = require('./hierarchyType_type');
const AssetMasterService = require('../../services/assetMaster');
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
