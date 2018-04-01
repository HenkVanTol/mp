import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import swal from 'sweetalert2'

import FormItemTextInput from './common/FormItemTextInput';
import FormItemCombo from './common/FormItemCombo';
import FormItemLabel from './common/FormItemLabel';
import FormItemDatePicker from './common/FormItemDatePicker';

import create from '../mutations/CreateInvoice';
import findById from '../queries/InvoiceByID';
import invoiceStatuses from '../queries/InvoiceStatuses';
import update from '../mutations/UpdateInvoice';

class Invoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            InvoiceID: null, InvoiceNumber: null, ContractID: null, ContractDescription: null, StatusID: null,
            StatusDescription: null, Value: null, DateRaised: moment(), errors: [], edit: false, InvoiceStatuses: []
        };

        console.log("params id: ", this.props.params.id);
        //edit existing
        if (this.props.params.id) {
            this.props.client.query({
                query: findById,
                variables: { InvoiceID: this.props.params.id },
            }).then((result) => {
                console.log("InvoiceByID result: ", result);
                let invoice = result.data.InvoiceByID[0];
                if (invoice) {
                    this.state = {
                        InvoiceID: invoice.InvoiceID, InvoiceNumber: invoice.InvoiceNumber, ContractID: invoice.ContractID,
                        ContractDescription: invoice.ContractDescription, StatusID: invoice.StatusID,
                        StatusDescription: invoice.StatusDescription, Value: invoice.Value, DateRaised: moment(invoice.DateRaised),
                        errors: [], edit: true
                    };
                }
            });
        }
        this.props.client.query({
            query: invoiceStatuses
        }).then((result) => {
            this.state.InvoiceStatuses = result.data.InvoiceStatuses;
        });
    }
    onSubmit(event) {
        event.preventDefault();
        const { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value } = this.state;
        if (this.state.edit == true) {
            console.log("editing...");
            this.props.client.mutate({
                mutation: update,
                variables: { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value }
            })
            .then(() => {
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: 'Invoice updated',
                    showConfirmButton: false,
                    timer: 1500
                  })
            })
            .catch(res => {
                const errors = res.graphQLErrors.map(error => error.message);
                this.setState({ errors }); //es6: name value is the same
            });
        }
        else {
            this.props.client.mutate({
                mutation: create,
                variables: { InvoiceNumber, ContractID, StatusID, DateRaised, Value }
            })
            .then(() => {
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: 'Invoice created',
                    showConfirmButton: false,
                    timer: 1500
                  })
            })
            .catch(res => {
                const errors = res.graphQLErrors.map(error => error.message);
                this.setState({ errors }); //es6: name value is the same
            });
        }
    }
    renderInvoiceStatuses() {
        return (
            this.state.InvoiceStatuses.map(status => {
                return <Option key={status.InvoiceStatusID} value={status.InvoiceStatusID}>{status.Ref}</Option>;
            })
        );
    }
    render() {
        if (this.props.data.loading) {
            return (
                <div>Loading...</div>
            )
        }
        else {
            return (
                <div>
                    Invoice
                    <Form layout="inline" onSubmit={this.onSubmit.bind(this)}>
                        <Row>
                            <FormItemLabel value="Invoice Number: " />
                            <Col span={1} />
                            <FormItemTextInput value={this.state.InvoiceNumber} onChange={e => this.setState({ InvoiceNumber: e.target.value })} />
                            <Col span={1} />
                            <FormItemLabel value="Contract ID: " />
                            <Col span={1} />
                            <FormItemTextInput value={this.state.ContractID} onChange={e => this.setState({ ContractID: e.target.value })} />
                            <Col span={1} />
                        </Row>

                        <Row>
                            <FormItemLabel value="Contract Description: " />
                            <Col span={1} />
                            <FormItemTextInput value={this.state.ContractDescription} onChange={e => this.setState({ ContractDescription: e.target.value })} />
                            <Col span={1} />
                            <FormItemLabel value="Status ID: " />
                            <Col span={1} />
                            <FormItemCombo value={this.state.StatusID} onChange={(value) => this.setState({ StatusID: value })}
                                renderOptions={this.renderInvoiceStatuses.bind(this)} />
                            <Col span={1} />
                        </Row>

                        <Row>
                            <FormItemLabel value="Status Description: " />
                            <Col span={1} />
                            <FormItemTextInput value={this.state.StatusDescription} onChange={e => this.setState({ StatusDescription: e.target.value })} />
                            <Col span={1} />
                            <FormItemLabel value="Value: " />
                            <Col span={1} />
                            <FormItemTextInput value={this.state.Value} onChange={e => this.setState({ Value: e.target.value })} />
                            <Col span={1} />
                        </Row>

                        <Row>
                            <FormItemLabel value="Date Raised: " />
                            <Col span={1} />
                            <FormItemDatePicker value={this.state.DateRaised}
                                onChange={(date, dateString) => { this.setState({ DateRaised: date }) }} />
                            <Col span={1} />
                        </Row>

                        <Row>
                            <Col span={8} />
                            <Col span={8}>
                                <Button type="primary" style={{ width: '100%' }} size="large" htmlType="submit" >Submit</Button>
                            </Col>
                            <Col span={8} />
                            <div className="errors">
                                {this.state.errors.map(error => <div key={error}>{error}</div>)}
                            </div>
                        </Row>
                    </Form>
                </div>
            );
        }
    }
}

export default withApollo(Invoice);