import React, { Component } from 'react';
import { Row, Col, Input, Form, Select } from 'antd';
const FormItem = Form.Item;

class FormItemTextInput extends Component {
    render() {
        return (
            <Col lg={6} sm={3}>
                <FormItem>
                    <Select style={{ width: 200 }} value={this.props.value} onChange={this.props.onChange} >
                        {this.props.renderOptions()}
                    </Select>
                </FormItem>
            </Col>
        );
    }
}

export default FormItemTextInput;