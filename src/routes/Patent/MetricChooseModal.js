import React, { PureComponent } from 'react';
import { Form, Modal, message, Radio, Input, InputNumber, Checkbox, Row, Col } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

class MetricChooseModal extends PureComponent {
  state = {};

  async componentDidMount() {}

  onChange = () => {};

  render() {
    const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form;
    const { showAddModel, form, onOk, handleAddModalVisible, metrics, choosenMetrics } = this.props;
    const fieldsValue = getFieldsValue();
    console.log(metrics);
    const okHandle = async () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        onOk({ ...fieldsValue });
      });
    };
    return (
      <Modal
        title={'选择指标'}
        visible={showAddModel}
        onOk={okHandle}
        onCancel={() => handleAddModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 24 }} label="">
          {getFieldDecorator('chosenMetrics', {
            initialValue: choosenMetrics,
          })(
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
              <Row>
                {metrics.map(metric => {
                  return (
                    <Col span={8} key={'col' + metric.id}>
                      <Checkbox value={metric.name} key={metric.id}>
                        {metric.name}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(MetricChooseModal);
