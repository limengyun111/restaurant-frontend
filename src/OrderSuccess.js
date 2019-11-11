import React from "react"
import { Card } from 'antd'
function OrderSuccess(props) {

    return (
        <div >
          <div style={{ background: '#ECECEC', padding: '30px',margin:"15px"}}>
          <Card title="下单成功" bordered={false} style={{ width: 300 }}>
            
            <h2>总价：{props.location.state && props.location.state.totalPrice}</h2>
        </Card>
  </div>


            
            
        </div>
    )
}


export default OrderSuccess