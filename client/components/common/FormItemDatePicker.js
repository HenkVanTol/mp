import React, { Component } from 'react';
import { Row, Col, DatePicker, Form } from 'antd';
const FormItem = Form.Item;

class FormItemDatePicker extends Component {
    render() {
        return (
            <Col lg={6} sm={3}>
                <DatePicker style={{ width: 200 }} value={this.props.value} onChange={this.props.onChange} />
            </Col>
        );
    }
}

export default FormItemDatePicker;