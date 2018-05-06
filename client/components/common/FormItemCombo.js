import React, { Component } from 'react';
import { Row, Col, Input, Form, Select } from 'antd';
const FormItem = Form.Item;

class FormItemCombo extends Component {
    render() {
        const formItemLayout = {
            wrapperCol: { span: 14 },
            labelCol: { span: 6 },
        };
        return (
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {/* <FormItem {...formItemLayout}> */}
                <FormItem>
                    <Select style={{ width: '100%', marginRight: '8px', marginBottom: '8px' }} value={this.props.value} onChange={this.props.onChange} >
                        {this.props.renderOptions()}
                    </Select>
                </FormItem>
            </Col>
        );
    }
}

export default FormItemCombo;