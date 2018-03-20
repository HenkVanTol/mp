import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import query from '../queries/AssetMaster';
import { Form, Row, Col, Input, Button, Table } from 'antd';
const FormItem = Form.Item;
import FormItemTextInput from './common/FormItemTextInput';
import {Link} from 'react-router';

class AssetSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', description: '', serial: '', registration: '', errors: [], dataSource: [] };
        this.columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        }, {
            title: 'Serial',
            dataIndex: 'serial',
            key: 'serial',
        }, {
            title: 'Registration',
            dataIndex: 'registration',
            key: 'registration',
        },
        {
            render: (text, record) => (
                <Link to={`/assetMaster/${record.id}`}>Edit</Link>
            )
        }];
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                console.log("selectedRows[0]: ", selectedRows[0]);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled', // Column configuration not to be checked
                name: record.name,
            }),
        };
    }
    search() {
        let { name, description, serial, registration } = this.state;
        this.props.client.query({
            query,
            variables: { name, description }
        }).then((result) => {
            this.setState({ dataSource: result.data.assetMaster });
        });
    }
    render() {
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <Row>
                            <Col span={8}>
                                <label>Name: </label>
                            </Col>
                            <Col span={16}>
                                <Input value={this.state.name}
                                    onChange={e => this.setState({ name: e.target.value })} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Row>
                            <Col span={8}>
                                <label>Description: </label>
                            </Col>
                            <Col span={16}>
                                <Input value={this.state.description}
                                    onChange={e => this.setState({ description: e.target.value })} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Button type="primary" style={{ width: '100%' }} size="large" onClick={() => this.search()}>Search</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <Table rowSelection={this.rowSelection} dataSource={this.state.dataSource} columns={this.columns} rowKey={record => record.id} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withApollo(AssetSearch);