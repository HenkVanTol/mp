import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, Label } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import create from '../mutations/CreateInvoice';
import findById from '../queries/InvoiceByID';
import findLookups from '../queries/InvoiceLookups';
import update from '../mutations/UpdateInvoice';

import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';

let state = {
    InvoiceID: null, InvoiceNumber: null, ContractID: null, ContractDescription: null, StatusID: null,
    StatusDescription: null, Value: null, DateRaised: moment(), errors: [], edit: false, InvoiceStatuses: [], Contracts: []
};

class InvoiceCreate extends Component {
    constructor(props) {
        super(props);
        this.state = state;
    }
    componentDidMount() {
        console.log("componentDidMount");
        this.props.client.query({
            query: findLookups,
            // options: {
            //     fetchPolicy: 'network-only'
            // }
        }).then((result) => {
            let lookups = result.data.InvoiceLookups;
            if (lookups) {
                console.log("LOOKUPS: ", lookups);
                this.mapState(lookups);
            }
        });
        this.setState(prevState => ({
            InvoiceNumber: prevState.InvoiceNumber,
            StatusID: prevState.StatusID,
            ContractID: prevState.ContractID,
            DateRaised: prevState.DateRaised,
            Value: prevState.Value
        }));
    }
    componentWillUnmount() {
        console.log("componentWillUnmount");
        // Remember state for the next mount
        state = this.state;
    }
    mapState(lookups) {
        this.setState({
            //DateRaised: moment(), errors: [], InvoiceStatuses: lookups.InvoiceStatuses, Contracts: lookups.Contracts
            InvoiceStatuses: lookups.InvoiceStatuses, Contracts: lookups.Contracts
        });
    }
    onSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                const { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value } = this.state;
                if (this.state.edit == true) {
                    this.props.client.mutate({
                        mutation: update,
                        variables: { InvoiceID, InvoiceNumber, ContractID, StatusID, DateRaised, Value }
                    }).then(() => {
                        this.props.client.query({
                            query: findById,
                            variables: { InvoiceID: this.props.params.id },
                            options: {
                                fetchPolicy: 'network-only'
                            }
                        }).then((result) => {
                            let invoice = result.data.InvoiceByID[0];
                            if (invoice) {
                                this.mapState(invoice);
                            }
                            toastr.success('Invoice Updated', 'Edit Invoice', { timeOut: 1000 });
                        });
                    }).catch(res => {
                        const errors = res.graphQLErrors.map(error => error.message);
                        this.setState({ errors });
                    });
                }
                else {
                    this.props.client.mutate({
                        mutation: create,
                        variables: { InvoiceNumber, ContractID, StatusID, DateRaised, Value }
                    }).then(() => {
                        toastr.success('Invoice Created', 'Create Invoice', { timeOut: 1000 });
                    }).catch(res => {
                        const errors = res.graphQLErrors.map(error => error.message);
                        this.setState({ errors });
                    });
                }
            }
            else {
                console.log("Validation errors");
            }
        });
    }
    renderInvoiceStatuses() {
        if (!this.props.data.loading) {
            return (
                this.state.InvoiceStatuses.map(status => {
                    return <Option key={status.InvoiceStatusID} value={status.InvoiceStatusID}>{status.Ref}</Option>;
                })
            );
        }
    }
    renderContracts() {
        if (!this.props.data.loading) {
            return (
                this.state.Contracts.map(contract => {
                    return <Option key={contract.ContractID} value={contract.ContractID}>{contract.Ref}</Option>;
                })
            );
        }
    }
    render() {
        if (this.props.data.loading) {
            return (
                <div>Loading...</div>
            )
        }
        else {
            const { getFieldDecorator } = this.props.form;
            const formItemLayout = {
                labelCol: {
                    xs: { span: 12 },
                    sm: { span: 12 },
                    md: { span: 12 },
                    lg: { span: 6 },
                    xl: { span: 6 }
                },
                wrapperCol: {
                    xs: { span: 12 },
                    sm: { span: 12 },
                    md: { span: 12 },
                    lg: { span: 6 },
                    xl: { span: 6 }
                },
            };
            const colLayout = {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 12 },
                xl: { span: 12 },
            };
            return (
                <div>
                    <h2>Create Invoice</h2>
                    <Form onSubmit={this.onSubmit.bind(this)} className="ant-advanced-search-form">
                        {/* <Row>
                            <FormItemLabel value="Contract: " />
                            <FormItemCombo value={this.state.ContractID} onChange={(value) => this.setState({ ContractID: value })}
                                renderOptions={this.renderContracts.bind(this)} />
                        </Row> */}
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Invoice Number" {...formItemLayout}>
                                    {
                                        this.props.params.id > 0 ?
                                            <span style={{ fontWeight: 'bold' }}>{this.state.InvoiceNumber}</span> :
                                            getFieldDecorator('invoiceNumber', {
                                                initialValue: this.state.InvoiceNumber,
                                                valuePropName: 'value',
                                                rules: [{
                                                    required: true,
                                                    message: 'Invoice Number is required',
                                                }],
                                            })(
                                                <Input onChange={e => this.setState({ InvoiceNumber: e.target.value })} />
                                            )
                                    }
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Contract" {...formItemLayout}>
                                    <Select value={this.state.ContractID} onChange={(value) => this.setState({ ContractID: value })} >
                                        {this.renderContracts()}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Status" {...formItemLayout}>
                                    <Select value={this.state.StatusID} onChange={(value) => this.setState({ StatusID: value })} >
                                        {this.renderInvoiceStatuses()}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Value" {...formItemLayout}>
                                    {getFieldDecorator('value', {
                                        initialValue: this.state.Value,
                                        valuePropName: 'value',
                                        rules: [{
                                            required: true,
                                            message: 'Value is required',
                                        }],
                                    })(
                                        <Input onChange={e => this.setState({ Value: e.target.value })} type="number" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Date Raised" {...formItemLayout}>
                                    <DatePicker value={this.state.DateRaised} onChange={(date, dateString) => { this.setState({ DateRaised: date }) }} />
                                </FormItem>
                            </Col>
                        </Row>
                        <br>
                        </br>
                        <Row>
                            <Col span={8} />
                            <Col span={8}>
                                <Button type="primary" style={{ width: '100%' }} size="large" htmlType="submit">Submit</Button>
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
export default withApollo(Form.create()(InvoiceCreate));