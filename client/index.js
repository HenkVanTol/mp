import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';

import App from './components/App';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AssetMaster from './components/AssetMaster';
import AssetSearch from './components/AssetSearch';
import requireAuth from './components/requireAuth';

import { DatePicker } from 'antd';

const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
      credentials: 'same-origin'
    }
  });
  
  const client = new ApolloClient({
    networkInterface,
    dataIdFromObject: o => o.id
  });

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={LoginForm} />
                    <Route path="login" component={LoginForm} />
                    <Route path="signup" component={SignupForm} />
                    <Route path="assetMaster" component={requireAuth(AssetMaster)} />
                    <Route path="assetSearch" component={requireAuth(AssetSearch)} />
                </Route>
            </Router>
        </ApolloProvider>
    );
};

//ReactDOM.render(<DatePicker />, document.querySelector('#root'));
ReactDOM.render(<Root />, document.querySelector('#root'));
