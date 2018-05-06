import React, { Component } from 'react';
import { Form } from 'antd';
import InvoiceEditForm from './InvoiceEdit';
import { graphql, withApollo } from 'react-apollo';

class InvoiceEditWrapper extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const WrappedInvoiceEdit = Form.create()(InvoiceEditForm);
        return (
            <WrappedInvoiceEdit />
        )
    }
}

export default InvoiceEditWrapper;


