import React, { Component } from 'react';
import { Row, Col, Label, Form } from 'antd';
const FormItem = Form.Item;

class FormItemLabel extends Component {
    render() {
        return (
            <Col lg={4} sm={2}>
                <FormItem>
                    <label>{this.props.value}</label>
                </FormItem>
            </Col>
        );
    }
}

export default FormItemLabel;