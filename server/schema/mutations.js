const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLFloat
} = graphql;

const UserType = require('./types/user_type');
const InvoiceSearchType = require('./types/invoiceSearch_type');
const AuthService = require('../services/auth');
const InvoiceService = require('../services/invoice');
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
        CreateInvoice: {
            type: InvoiceSearchType,
            args: {
                InvoiceNumber: { type: GraphQLString },
                ContractID: { type: GraphQLInt },
                StatusID: { type: GraphQLInt },
                DateRaised: { type: GraphQLDate },
                Value: { type: GraphQLFloat }
            },
            resolve(parentValue, { InvoiceNumber, ContractID, StatusID, DateRaised, Value }) {
                return InvoiceService.CreateInvoice({ InvoiceNumber, ContractID, StatusID, DateRaised, Value });
            }
        },
        UpdateInvoice: {
            type: InvoiceSearchType,
            args: {
                InvoiceID: { type: GraphQLInt },
                InvoiceNumber: { type: GraphQLString },
                ContractID: { type: GraphQLInt },
                StatusID: { type: GraphQLInt },
                DateRaised: { type: GraphQLDate },
                Value: { type: GraphQLFloat }
            },
            resolve(parentValue, { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value }) {
                return InvoiceService.UpdateInvoice({ InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value });
            }
        }
    }
});

module.exports = mutation;