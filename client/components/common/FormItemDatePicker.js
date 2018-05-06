import React, { Component } from 'react';
import { Row, Col, DatePicker, Form } from 'antd';
const FormItem = Form.Item;

class FormItemDatePicker extends Component {
    render() {
        return (
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItem>
                    <DatePicker style={{ width: '100%', marginRight: '8px', marginBottom: '8px' }} value={this.props.value} onChange={this.props.onChange} />
                </FormItem>
            </Col>
        );
    }
}

export default FormItemDatePicker;