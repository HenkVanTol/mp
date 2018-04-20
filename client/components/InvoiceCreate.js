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
import FormItemLabelBold from './common/FormItemLabelBold';
import FormItemDatePicker from './common/FormItemDatePicker';

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
                console.log("InvoiceByID result (mount): ", result.data.InvoiceByID[0]);
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
        }, () => console.log("setState done"), () => console.log("setState error"));
    }
    onSubmit(event) {
        event.preventDefault();
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
                    console.log("InvoiceByID result: ", result.data.InvoiceByID[0]);
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
            return (
                <div>
                    <h2>Edit Invoice</h2>
                    {/* <Form layout="inline" onSubmit={this.onSubmit.bind(this)}> */}
                    {/* <Form layout="inline"> */}
                        <Row>
                            <FormItemLabel value="Invoice Number: " />
                            {/* <FormItemTextInput value={this.state.InvoiceNumber} onChange={e => this.setState({ InvoiceNumber: e.target.value })} /> */}
                            <FormItemLabelBold value={this.state.InvoiceNumber} />
                            <FormItemLabel value="Contract: " />
                            {/* <FormItemTextInput value={this.state.ContractID} onChange={e => this.setState({ ContractID: e.target.value })} /> */}
                            <FormItemCombo value={this.state.ContractID} onChange={(value) => this.setState({ ContractID: value })}
                                renderOptions={this.renderContracts.bind(this)} />
                        </Row>

                        <Row>
                            <FormItemLabel value="Contract Description: " />
                            {/* <FormItemTextInput value={this.state.ContractDescription} onChange={e => this.setState({ ContractDescription: e.target.value })} /> */}
                            <FormItemLabelBold value={this.state.ContractDescription} />
                            <FormItemLabel value="Status: " />
                            <FormItemCombo value={this.state.StatusID} onChange={(value) => this.setState({ StatusID: value })}
                                renderOptions={this.renderInvoiceStatuses.bind(this)} />
                        </Row>

                        <Row>
                            <FormItemLabel value="Current Status: " />
                            {/* <FormItemTextInput value={this.state.StatusDescription} onChange={e => this.setState({ StatusDescription: e.target.value })} /> */}
                            <FormItemLabelBold value={this.state.StatusDescription} />
                            <FormItemLabel value="Value: " />
                            <FormItemTextInput value={this.state.Value} onChange={e => this.setState({ Value: e.target.value })} />
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
                                <Button type="primary" style={{ width: '100%' }} size="large" onClick={this.onSubmit.bind(this)} >Submit</Button>
                                {/* htmlType="submit" */}
                            </Col>
                            <Col span={8} />
                            <div className="errors">
                                {this.state.errors.map(error => <div key={error}>{error}</div>)}
                            </div>
                        </Row>
                    {/* </Form> */}
                </div>
            );
        }
    }
}
// export default graphql(findById, {
//     options: (props) => { return { variables: { id: props.params.id } } }
// })(Invoice);
export default withApollo(InvoiceCreate);