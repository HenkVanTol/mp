import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import moment from 'moment';
import { Form, Row, Col, Input, Button, DatePicker, Select, Label } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import swal from 'sweetalert2'

import FormItemTextInput from './common/FormItemTextInput';
import FormItemCombo from './common/FormItemCombo';
import FormItemLabel from './common/FormItemLabel';
import FormItemLabelBold from './common/FormItemLabelBold';
import FormItemDatePicker from './common/FormItemDatePicker';

import create from '../mutations/CreateInvoice';
import findById from '../queries/InvoiceByID';
import update from '../mutations/UpdateInvoice';

import toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';

class InvoiceEdit extends Component {
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
                            // swal({
                            //     position: 'top-end',
                            //     type: 'success',
                            //     title: 'Invoice updated',
                            //     showConfirmButton: false,
                            //     animation: false,
                            //     imageWidth: 100,
                            //     imageHeight: 50,
                            //     timer: 1000
                            // });
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
                    md: { span: 6 },
                    lg: { span: 6 },
                    xl: { span: 6 }
                },
                wrapperCol: {
                    xs: { span: 12 },
                    sm: { span: 12 },
                    md: { span: 6 },
                    lg: { span: 6 },
                    xl: { span: 6 }
                },
            };
            // const formItemLayout = {
            //     wrapperCol: { span: 200 },
            //     labelCol: { span: 200 },
            // };
            // const formItemLayout = {
            //     labelCol: { span: 6 },
            //     wrapperCol: { span: 14 },
            //   };
            return (
                <div>
                    <h2>Edit Invoice</h2>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        {/* <Row>
                            <FormItemLabel value="Invoice Number: " />
                            <FormItemLabelBold value={this.state.InvoiceNumber} />
                            <FormItemLabel value="Contract: " />
                            <FormItemCombo value={this.state.ContractID} onChange={(value) => this.setState({ ContractID: value })}
                                renderOptions={this.renderContracts.bind(this)} />
                        </Row> */}

                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                {/* <FormItemLabel value="Contract Description: " /> */}
                                {/* <FormItemLabelBold value={this.state.ContractDescription} /> */}
                                {/* <FormItemLabel value="Status: " /> */}
                                <FormItem label="Status" {...formItemLayout}>
                                    <Select value={this.props.value} onChange={this.props.onChange} >
                                        {this.renderInvoiceStatuses()}
                                    </Select>
                                </FormItem>
                                {/* <FormItemCombo value={this.state.StatusID} onChange={(value) => this.setState({ StatusID: value })}
                                renderOptions={this.renderInvoiceStatuses.bind(this)} /> */}
                            </Col>
                        </Row>

                        {/* <Row>
                            <FormItemLabel value="Current Status: " />
                            <FormItemLabelBold value={this.state.StatusDescription} />
                            <FormItemLabel value="Value: " />
                            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <FormItem {...formItemLayout}>
                                    {getFieldDecorator('value', {
                                        initialValue: this.state.Value,
                                        valuePropName: 'value',
                                        rules: [{
                                            required: true,
                                            message: 'Value is required',
                                        }],
                                    })(
                                        <Input style={{ width: '100%', marginRight: '8px', marginBottom: '8px' }}
                                            onChange={e => this.setState({ Value: e.target.value })}
                                            type="number"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <FormItemLabel value="Date Raised: " />
                            <FormItemDatePicker value={this.state.DateRaised}
                                onChange={(date, dateString) => { this.setState({ DateRaised: date }) }} />
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
                        </Row> */}
                    </Form>
                </div>
            );
        }
    }
}
// export default graphql(findById, {
//     options: (props) => { return { variables: { id: props.params.id } } }
// })(Invoice);
export default withApollo(Form.create()(InvoiceEdit));