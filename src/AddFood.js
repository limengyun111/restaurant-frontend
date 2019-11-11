import React from "react"
import { Button, Modal, Form, Input } from 'antd';
import api from "./api"

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="请添加菜品"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="菜品名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="菜品描述">
              {getFieldDecorator("dec")(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="菜品价格">
              {getFieldDecorator('price')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="菜品分类">
              {getFieldDecorator('category')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="菜品状态">
              {getFieldDecorator("status")(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="菜品图片">
              {getFieldDecorator("img")(<Input type="file" ref={this.props.passref}/>)}
            </Form.Item>     
           
          </Form>
        </Modal>
      );
    }
  },
);

class AddFood extends React.Component {
  imgRef = React.createRef()
  
  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({ visible: true });
  };
  

  handleCancel = () => {
    this.setState({ visible: false });
  };
  
  handleCreate = () => {

    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
    

      console.log('Received values of form: ', values);
      
      var fd = new FormData()
     
      for(var key in values) {
        var val = values[key]
        
       
        fd.append(key,val)
      } 
      fd.append("img",this.imgRef.current.input.files[0])
      console.log("img",this.imgRef.current.input.files[0])
     
      console.log("fd",fd)
      api.post("/restaurant/1/food",fd)
      form.resetFields();
      this.setState({ visible: false });

    });
  
    this.props.renderAgain()
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal} >
          添加菜品
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          renderAgain = { this.props.renderAgain }
          passref = {this.imgRef}
        />
      </div>
    );
  }
}



export default AddFood