import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import AuthForm from './AuthForm';
import mutation from '../mutations/Login';
import { graphql } from 'react-apollo';
import query from '../queries/CurrentUser';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = { errors: [] };
    }

    componentWillUpdate(nextProps) {
        //console.log(this.props, nextProps) //the old, current set of props
        //nextProps //next set of props when the component rerenders
        if (!this.props.data.user && nextProps.data.user) {
            //redirect to dashboard
            //user wasn't signed in but now is
            hashHistory.push('/invoiceSearch');
        }
    }
    onSubmit({ email, password }) {
        this.props.mutate({
            variables: { email, password },
            refetchQueries: [{ query }]
        }).catch(res => {
            const errors = res.graphQLErrors.map(error => error.message);
            this.setState({ errors }); //es6: name value is the same
        });
    }
    render() {
        return (
            <div>
                <h4>Login</h4>
                <AuthForm errors={this.state.errors} onSubmit={this.onSubmit.bind(this)} />
            </div>
        );
    }
}

export default graphql(query)(
    graphql(mutation)(LoginForm)
);