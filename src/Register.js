import { Form, Icon, Input, Button } from 'antd';
import React from 'react';
import api from './api';
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props)
    
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        
        api.post("/register",values).then((res)=> {
          console.log("res",res.data)
          if(res.data.code === 0){
      
            this.props.history.push(`/login`)
           
          }else{
            alert("用户名已存在")
          }
        })
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="inline" onSubmit={this.handleSubmit} style={{margin:"30px auto",width:"200px"}}>
        <h3 style={{margin:0}}>用户名 </h3>
        <Form.Item style={{marginBottom:"10px"}} validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item><br/>
        <h3 style={{margin:0}}>密码 </h3>
        <Form.Item style={{marginBottom:"10px"}} validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item><br/>
        <h3 style={{margin:0}}>餐厅名称 </h3>
       <Form.Item style={{marginBottom:"10px"}} validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="font-size" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="text"
              placeholder="Title"
            />,
          )}
        </Form.Item><br/>
        <h3 style={{margin:0}}>邮箱 </h3>
        <Form.Item style={{marginBottom:"10px"}} validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your Email!' }],
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="email"
              placeholder="Email"
            />,
          )}
        </Form.Item><br/>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const Register = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);

export default Register