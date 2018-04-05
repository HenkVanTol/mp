import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import query from '../queries/InvoiceSearch';
import { Form, Row, Col, Input, Button, Table } from 'antd';
const FormItem = Form.Item;
import FormItemTextInput from './common/FormItemTextInput';
import FormItemLabel from './common/FormItemLabel';
import { Link } from 'react-router';

class InvoiceSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { InvoiceNumber: '', InvoiceStatusID: null, errors: [], dataSource: [] };
        this.columns = [{
            title: 'Invoice Number',
            dataIndex: 'InvoiceNumber',
            key: 'InvoiceNumber',
        }, {
            title: 'Contract',
            dataIndex: 'ContractDescription',
            key: 'ContractDescription',
        }, {
            title: 'Status',
            dataIndex: 'StatusDescription',
            key: 'StatusDescription',
        }, {
            title: 'Value',
            dataIndex: 'Value',
            key: 'Value',
        }, {
            title: 'Date Raised',
            dataIndex: 'DateRaised',
            key: 'DateRaised',
        },
        {
            render: (text, record) => (
                <Link to={`/invoice/${record.InvoiceID}`}>Edit</Link>
            )
        }];
        // this.rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //         console.log("selectedRows[0]: ", selectedRows[0]);
        //     },
        // };
    }
    search() {
        let { InvoiceNumber, StatusID } = this.state;
        this.props.client.query({
            query,
            variables: { InvoiceNumber, StatusID },
            options: {
              fetchPolicy: 'network-only'
            }
        }).then((result) => {
            console.log("result.data: ", result.data.InvoiceSearch);
            this.setState({ dataSource: result.data.InvoiceSearch });
        });
    }
    render() {
        return (
            <div>
                <Row gutter={16}>
                    <FormItemLabel value="Invoice Number: " />
                    <FormItemTextInput value={this.state.InvoiceNumber} onChange={e => this.setState({ InvoiceNumber: e.target.value })} />
                </Row>
                <Row gutter={16}>
                    <FormItemLabel value="Status: " />
                    <FormItemTextInput value={this.state.StatusID} onChange={e => this.setState({ StatusID: e.target.value })} />
                </Row>
                <Row gutter={16}>
                    <Col>
                        <Button type="primary" style={{ width: '50%' }} size="large" onClick={() => this.search()}>Search</Button>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <div className="errors">
                        {this.state.errors.map(error => <div key={error}>{error}</div>)}
                    </div>
                </Row>
                <Row gutter={16}>
                    <Col span={16}>
                        <Table rowSelection={this.rowSelection} dataSource={this.state.dataSource} columns={this.columns} rowKey={record => record.InvoiceID} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withApollo(InvoiceSearch);