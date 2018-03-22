const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = graphql;

const UserType = require('./types/user_type');
const AssetMasterType = require('./types/asset_master_type');
const AuthService = require('../services/auth');
const AssetMasterService = require('../services/assetMaster');
const GraphQLDate = require('graphql-date');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) { //request is request object from express
                return AuthService.signup({ email, password, req });
            }
        },
        logout: {
            type: UserType,
            resolve(parentValue, args, req) {
                const { user } = req;
                req.logout();
                return user;
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                return AuthService.login({ email, password, req });
            }
        },
        createAssetMaster: {
            type: AssetMasterType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                serial: { type: GraphQLString },
                registration: { type: GraphQLString },
                acquisitionDate: { type: GraphQLDate },
                retirementDate: { type: GraphQLDate },
                hierarchyTypeId: { type: GraphQLInt }
            },
            resolve(parentValue, { name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId }) {
                return AssetMasterService.create({ name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId });
            }
        },
        updateAssetMaster: {
            type: AssetMasterType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                serial: { type: GraphQLString },
                registration: { type: GraphQLString },
                acquisitionDate: { type: GraphQLDate },
                retirementDate: { type: GraphQLDate },
                hierarchyTypeId: { type: GraphQLInt }
            },
            resolve(parentValue, { name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId }) {
                return AssetMasterService.update({ name, description, serial, registration, acquisitionDate, retirementDate, hierarchyTypeId });
            }
        }
        // editCustomer: {
        //     type: CustomerType,
        //     args: {
        //         id: { type: GraphQLInt },
        //         name: { type: GraphQLString },
        //         surname: { type: GraphQLString },
        //         email: { type: GraphQLString },
        //         purchases: { type: GraphQLInt }
        //     },
        //     resolve(parentValue, { id, name, surname, email, purchases }) {
        //         console.log("resolver for customer")
        //         return CustomerService.editCustomer({ id, name, surname, email, purchases });
        //     }
        // }
    }
});

module.exports = mutation;