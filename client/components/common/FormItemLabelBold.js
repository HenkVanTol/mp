import React, { Component } from 'react';
import { Row, Col, Form } from 'antd';
const FormItem = Form.Item;

class FormItemLabelBold extends Component {
    render() {
        return (
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItem>
                    <label style={{ fontWeight: 'bold' }}>{this.props.value}</label>
                </FormItem>
            </Col>
        );
    }
}

export default FormItemLabelBold;