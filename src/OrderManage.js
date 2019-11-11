import React, { Component} from "react"
import io from "socket.io-client"
import api from "./api"
import { Card } from 'antd';


function OrderItem(props) {

  
 
  return(
      <div style={{margin:"15px"}}>
       <Card size="small" title={props.order.deskName} style={{ width: 300,margin:"auto" }}>
        <p>总价格：{ props.order.totalPrice }</p>
        <p>用餐人数：{ props.order.customCount }</p>
        
    </Card>
      </div>
  )
}

class OrderManage extends Component{
    constructor() {
      super()
      this.state={
          orders:[]
      }
    }
 componentDidMount() {
     var params = this.props.match.params
    this.socket = io()

    this.socket.on("connect",() => {
        
        this.socket.emit("join restaurant","restaurant:" + params.rid)
    })
    this.socket.on("new order",order => {
        this.setState(state => ({
            orders: [order,...state.orders]
        }))
    })

    
 

    api.get(`/restaurant/${params.rid}/order`).then((res) => {
        this.setState({
            orders:res.data
        })
    })
 }
//  componentWillUnmount() {
//     this.socket.close()
// }



  render() {
    return(
        <div>
            <h3 style={{marginLeft:"40px",width:"100px"}}>订单管理</h3>
            <div>
            {this.state.orders.length > 0 ?
                this.state.orders.map(order=> {
                    return <OrderItem order={order} key={order.id}/>
                }):
                <div>loading...</div>
            }
            </div>
        </div>
    )
  }

}





   



export default OrderManage