
import React ,{Suspense}from "react";
import {

  withRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import api from "./api";
import { Button } from 'antd';
import createFetcher from "./create-fetcher"
import FoodManagae from "./FoodManage";
import OrderManage from "./OrderManage";
import DeskManage from "./DeskManage";
import history from './history'
import back from "./background.css"
const titleStyle = {
  height:"30px",
  margin:"20px",
  fontSize:"20px",
  textAlign:"center",
  
}
var userinfoFetcher = createFetcher(async function () {
  return await api.get("/userinfo").catch(()=>{
    history.push('/login')
  })
  
})

  function Bossinfo () {
  // 配合suapense获取同步获取餐厅信息
  var info = userinfoFetcher.read().data
  console.log("info",info)
  return  (
    <div style={ titleStyle }>
    欢迎 <span style={{fontFamily:"'Comic Sans MS', cursive, sans-serif",
  
  }}>{ info.title } </span>餐厅管理者登陆
  </div>
  )
}




export default withRouter(function (props) {

 async function logout () {
    await api.get("/logout")
    userinfoFetcher.clearCache()
    props.history.push("/")
 }
 
  return (
    
      <div>
        <Suspense fallback={<div>loading...</div>}>
          <Bossinfo>  
          </Bossinfo>
        </Suspense>
      
        <nav>

          <ul style={{listStyle:"none",width:"200px",margin:"auto",fontSize:"20px",color:"yellow"}}>
            <li>
              <Link style={{color:"rgb(191, 181, 84)"}} to="order">订单管理</Link>
            </li>
            <li>
              <Link style={{color:"rgb(85, 138, 120)"}} to="food">菜品管理</Link>
            </li>
            <li>
              <Link style={{color:"rgb(125, 85, 138)"}} to="desk">桌面管理</Link>
            </li>
            
              <Button  type="primary" 
              onClick={ logout } size="large"
              style={{marginTop:"20px"}}
              >退出</Button>
          
          </ul>
        </nav>
       
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/restaurant/:rid/manage/order" component={OrderManage}>
        
          </Route>
          <Route path="/restaurant/:rid/manage/food/" component={FoodManagae}>
          </Route>
          <Route path="/restaurant/:rid/manage/desk">
            <DeskManage />
       
          </Route>
        </Switch>
      </div>
  );
}
)


// export default withRouter(Manage)

// function Users() {
//   return <h2>Users</h2>;
// }

