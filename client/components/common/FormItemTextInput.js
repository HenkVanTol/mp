import React, { Component } from 'react';
import { Row, Col, Input, Form } from 'antd';
const FormItem = Form.Item;

class FormItemTextInput extends Component {
    render() {
        return (
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItem>
                    <Input value={this.props.value} onChange={this.props.onChange} />
                </FormItem>
            </Col>
        );
    }
}

export default FormItemTextInput;