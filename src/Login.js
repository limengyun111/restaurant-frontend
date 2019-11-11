import React from "react"
import api from "./api";
import { Form, Icon, Input, Button } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
 
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
      
        await api.post("/login",{
          
          values:values
        }).then((res)=>{ 
          console.log("res",res.data)
          if(res.data.code === -1){
            console.log("code",res.code)
            alert("用户名或密码错误")
          }else{
            this.props.history.push(`/restaurant/${res.data.id}/manage/`) 
          }
          })
      // 登录成功后跳转到manage组件
    
      //this.props.history.push("./manage")
        
      } else{
        alert("ss")
      }
    });

  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div>
        <h2 style={{textAlign:"center",margin:"20px"}}>欢迎管理者登陆</h2>
      <Form layout="inline" onSubmit={this.handleSubmit} style={{margin:"auto",width:"200px",height:"100px"}}>
        <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Log in
          </Button>
        </Form.Item>
      </Form>
      </div>
    );
  }

}




const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);
  export default WrappedHorizontalLoginForm
