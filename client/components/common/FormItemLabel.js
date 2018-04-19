import React, { Component } from 'react';
import { Row, Col, Label, Form } from 'antd';
const FormItem = Form.Item;

class FormItemLabel extends Component {
    render() {
        return (
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {/* <FormItem> */}
                    <span style={{ width: '100%', marginRight: '8px', marginBottom: '8px' }}>{this.props.value}</span>
                {/* </FormItem> */}
            </Col>
        );
    }
}

export default FormItemLabel;