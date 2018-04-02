import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import InvoiceSearch from './components/InvoiceSearch';
import Invoice from './components/Invoice';
import requireAuth from './components/requireAuth';

import { DatePicker } from 'antd';
const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  }
const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  });
  
  const client = new ApolloClient({
    networkInterface,
    dataIdFromObject: o => o.id,
    defaultOptions: defaultOptions
  });

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={LoginForm} />
                    <Route path="login" component={LoginForm} />
                    <Route path="signup" component={SignupForm} />
                    <Route path="invoice" component={requireAuth(Invoice)} />
                    <Route path="invoiceSearch" component={requireAuth(InvoiceSearch)} />
                    <Route path="invoice/:id" component={requireAuth(Invoice)} />
                </Route>
            </Router>
         </ApolloProvider>
    );
};

ReactDOM.render(<Root />, document.querySelector('#root'));
