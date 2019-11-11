import React, { Component, useState} from 'react';
import {  Button, Icon, } from 'antd';
import api from './api';

import history from "./history"
import io from "socket.io-client"


const ButtonGroup = Button.Group
// margin-right怎么写？？？
const imgStyle = {
    float:"left",
    width:"100px",
    height:"100px",
    borderRadius:"10px",
    
}
// 圆角边框怎么写
const detailStyle = {
	width:"200px",
	border:"1px solid",
	borderRadius:"8px",
	position:"fixed",
	bottom:"95px",
	left:"1px",
	right:"1px",
	backgroundColor:"white"
}
const cartStyle = {
    position:"fixed",
    height:"50px",
		bottom:"60px",
		border:"1px solid",
		borderRadius: "10px",
    left:"1px",
    right:"1px",
    backgroundColor:"white"
}


function MenuItem ({food,onUpdate,amount}) {
 
    
    function dec () {
			// if(amount === 0){
			// 	return
			// }
      
      onUpdate(food,amount - 1)
    }
    function inc () {
      
			onUpdate(food,amount + 1)
    }

    return (
    <div style={{margin:"30px 30px"}}> 
     <h3>{food.name}</h3>
     <img style={ imgStyle } src={"../upload/"+ food.img} alt={food.name} />
     <p>菜品描述{ food.dec }</p>
     <p>菜品价格{ food.price }</p>
     <div>
     <ButtonGroup>
      <Button onClick={ dec }>-</Button>
      <Button>{ amount }</Button>
      <Button onClick={ inc }>+</Button>
    </ButtonGroup>
     </div>
    </div>

 )
}

// 因为上层组件和下层组件都要用到总价，所以抽成一个函数
function calcTotalPrice(cartAry) {

    return cartAry.reduce((total,item) => {
			 
        return total + item.food.price * item.amount
    },0)
}

function CartDetails(props) {
	var foods = props.foods
	
	return(
  <ul style={detailStyle}>
		{
			foods.map(food => {
		
				return <li key={food.food.id}>
					菜品名称：{food.food.name} <br/>
					菜品价格：{food.food.price}
				</li>
			})
		}
	</ul>
		
	
	)
}



function CartStatus (props) {
 var [expend,setExpend] = useState(false)

 var totalPrice = calcTotalPrice(props.foods)

   return (
    <div>
	   {expend === true ? <CartDetails foods={props.foods}/>:""}
     <div style={cartStyle}>
        
        <Icon type="shopping-cart"  style={{ fontSize: '30px',margin:"5px"}}/>
        {expend ?
         <Button type="primary" style={{margin:"5px"}} size="small"
         onClick = {()=> {setExpend(false)}}
         >查看详情
         </Button> :
         <Button type="primary" style={{margin:"5px"}} size="small"
         onClick = {()=> {setExpend(true)}}
         >收起</Button>
        }
        
         <Button type="primary" style={{margin:"15px"}} size="small"
         onClick={() => { props.OnplaceOrder() }}>下单</Button>
         <strong style={{margin:"10px"}}>总价：{ totalPrice }</strong>
     </div>
  </div>
 )
}

// 为什么这个函数不能包裹在FoodCart里面？？？
// var fetcher = createfetcher (()=>{
//     return api.get("/menu/restaurant/1")
// })

export default class FoodCart extends Component{
    constructor(props) {
			super(props)
			this.state={
				cart:[],
				foodMenu:[],
				deskInfo:{},
		    loading:false,
			}
		}
		componentWillUnmount() {
			this.socket.close()
		}
       componentDidMount() {
	
		var params = this.props.match.params

		api.get("/deskinfo?did=" + params.did).then((res) => {
			this.setState({
				deskInfo:res.data,
			})
		})

		api.get("/menu/restaurant/"+params.rid).then(res => {
	
			this.setState({
				foodMenu: res.data,
			})
		})

		this.socket = io()
		this.socket.on("connect",()=>{
		 // 连接成功后告诉后端要加入哪个房间
		
		this.socket.emit("join desk","desk:" + params.did)
		})
	
		// 后端发回已经点过的菜单
		this.socket.on("cart food",info => {
	
            this.setState({
				cart:[...this.state.cart,...info]
			})
		})
		// 当后端订单改变的时候发送消息，前端把消息传到changeCount函数中，从而改变订单状态
		// 来自同桌的新增菜单
    this.socket.on("new food",info => {
			
			this.changeCount(info.food,info.amount)
		})

		this.socket.on("order success",order => {
			history.push({
				pathname: `/r/${params.rid}/d/${params.did}/order-success`,
				state: order
		})
		})

	}
	
 // 当购物车改变的时候实时发送回后端
	cartChange= (food,amount) => {
	
		  var params = this.props.match.params
			this.socket.emit("new food",{desk:"desk:"+params.did,food,amount})
			
	}

	
	placeOrder= () =>{
		var params = this.props.match.params
		api.post(`/restaurant/${params.rid}/desk/${params.did}/order`,{
			foods:this.state.cart,
			deskName: this.state.deskInfo.name,
			totalPrice:calcTotalPrice(this.state.cart),
			count:params.count,
	}).then((res) => {
			history.push({
					pathname: `/r/${params.rid}/d/${params.did}/order-success`,
					state: res.data,
			})
			
	})
}

changeCount=(food,amount) =>{
     
	var idx = this.state.cart.findIndex(it => it.food.id === food.id)
	if(idx >= 0) {
		if(amount === 0) {
		    this.setState({
					cart: [
						...this.state.cart.slice(0,idx),
						...this.state.cart.slice(idx + 1) 
				 ]
				})
		} else {
			 this.setState({
				 cart: [
				 ...this.state.cart.slice(0,idx),
				 { food,
						 amount,
				 },
				 ...this.state.cart.slice(idx+1)
			 
		 ]
			 })
 }
	} else {
	 this.setState({
    cart:[
			...this.state.cart,
			{food,
			 amount:amount
			}
	  ]
	 })
	 
	}
	
}

  render() {
	
		
			return(
				<div>
				
				   <div>
						<h2 style={{margin:"20px auto",width:"100px"}}>开始点餐</h2>
						<div>	
							{this.state.foodMenu.map(food => {
								var currentAmount = 0
						  
								var currentCartItem = this.state.cart.find(cartItem => 
								cartItem.food.id === food.id
								)
							if(currentCartItem) {
								currentAmount = currentCartItem.amount
							}
						
							return  <MenuItem key={food.id} food ={food} 
							onUpdate= {this.cartChange} amount={currentAmount}
							></MenuItem>
							})}
						</div>
               
						<CartStatus 
					  	 foods={this.state.cart} 
					  	 onUpdate= {this.cartChange} 
						   OnplaceOrder={this.placeOrder } /> 
							</div>
						
					</div>
			)
		

			// console.log("this.state.foodMenu",this.state.foodMenu)
			// console.log("this.state.cart",this.state.cart)
      // return(
			// 	<div>
				
			// 	   <div>
			// 			<h2>开始点餐</h2>
			// 			<div>	

			// 					{this.state.foodMenu
			// 					.map(food => {
			// 					 var currentAmount = 0
							
      //            var currentCartItem = this.state.cart.find(cartItem => 
			// 						cartItem.food.id === food.id
			// 					 )
      //           if(currentCartItem) {
			// 						currentAmount = currentCartItem.amount
			// 					}
			// 					return  <MenuItem key={food.id} food ={food} 
			// 					onUpdate= {this.cartChange} amount={currentAmount}
			// 					></MenuItem>
			// 					})}
			// 			</div>
               
			// 			<CartStatus foods={this.state.cart} onUpdate= {this.cartChange} OnplaceOrder={
			// 				this.placeOrder } /> 
			// 				</div>
						
			// 		</div>
						
				// )
						
    }
}



/*
function FoodCart () {
    var params = useParams()
    
    var [deskInfo,setdeskInfo] = useState()
    useEffect(() => {
        api.get("/deskinfo?did=" + params.did).then((res) => {
          setdeskInfo(res.data)
        })
    },[])
    var foods = fetcher.read().data
    // 用来储存用户点了什么菜，点了多少份
    
    var [cart,setCart] = useState([])
    console.log(cart)
    function changeCount(food,amount) {
     
      var idx = cart.findIndex(it => it.food.id === food.id)
      if(idx >= 0) {
        if(amount === 0) {
        
            setCart([
               ...cart.slice(0,idx),
               ...cart.slice(idx + 1) 
            ])
        } else {
            setCart([
            ...cart.slice(0,idx),
            { food,
                amount,
            },
            ...cart.slice(idx+1)
          
        ])
     }
      } else {
      
       setCart([
           ...cart,
           {food,
            amount:amount
           }
       ])
      }
      
    }
    // 需要发送的内容
    //   var rid = req.params.rid
    //   var did = req.params.did
    //   var customCount = req.body.count
    //   var deskName = req.body.deskName
    //   var menuDetails = JSON.stringify(req.body.foods)
    //   var status= "pending" //condirmed/completed
    //   var totalPrice = req.body.totalPrice
    //   var timestamp = new Date().toISOString()
    function placeOrder() {
        api.post(`/restaurant/${params.rid}/desk/${params.did}/order`,{
            foods:cart,
          deskName: deskInfo.name,
          totalPrice:calcTotalPrice(cart),
          count:params.count,
      }).then((res) => {
          history.push({
              pathname: `/r/${params.rid}/d/${params.did}/order-success`,
              state: res.data,
          })
          
      })
    }
    // 为什么App.js里面要写上history={},下层组件才可以接收到state???
    return(
        <div>
            <h2>开始点餐</h2>
            <div>
                
                {foods.map(food => {
                  return  <MenuItem key={food.id} food ={food} 
                  changeCount={ changeCount }
                 ></MenuItem>
                })}
            </div>
           
           <CartStatus foods={cart} onUpdate= {changeCount} OnplaceOrder={
              placeOrder 
           } /> 
         
        </div>
    )
}
*/

 
                   
   