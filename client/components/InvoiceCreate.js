import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, Label } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import create from '../mutations/CreateInvoice';
import findById from '../queries/InvoiceByID';
import update from '../mutations/UpdateInvoice';

import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';

class InvoiceCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            InvoiceID: null, InvoiceNumber: null, ContractID: null, ContractDescription: null, StatusID: null,
            StatusDescription: null, Value: null, DateRaised: moment(), errors: [], edit: false, InvoiceStatuses: [], Contracts: []
        };
    }
    componentDidMount() {
        //edit existing
        if (this.props.params.id) {
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
            });
        }
    }
    mapState(invoice) {
        this.setState({
            InvoiceID: invoice.InvoiceID, InvoiceNumber: invoice.InvoiceNumber, ContractID: invoice.ContractID,
            ContractDescription: invoice.ContractDescription, StatusID: invoice.StatusID,
            StatusDescription: invoice.StatusDescription, Value: invoice.Value, DateRaised: moment(invoice.DateRaised),
            errors: [], edit: true, InvoiceStatuses: invoice.InvoiceStatuses, Contracts: invoice.Contracts
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
                        swal({
                            position: 'top-end',
                            type: 'success',
                            title: 'Invoice created',
                            showConfirmButton: false,
                            imageWidth: 100,
                            imageHeight: 50,
                            timer: 1000,
                            animation: false
                        })
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
                                <FormItem label="Contract Description" {...formItemLayout}>
                                    <span style={{ fontWeight: 'bold' }}>{this.state.ContractDescription}</span>
                                </FormItem>
                            </Col>
                            <Col {...colLayout}>
                                <FormItem label="Status" {...formItemLayout}>
                                    <Select value={this.state.StatusID} onChange={(value) => this.setState({ StatusID: value })} >
                                        {this.renderInvoiceStatuses()}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col {...colLayout}>
                                <FormItem label="Current Status" {...formItemLayout}>
                                    <span style={{ fontWeight: 'bold' }}>{this.state.StatusDescription}</span>
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